import React, { useEffect } from 'react'
import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon, Input } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../src/supabaseClient';
import { Button } from 'react-native';
import styles from '../styles/mainScreens'
import { Header } from '../components/Header'

export const AddScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true)
    const [image, setImage] = useState(null);
    const [pImage, setPImage] = useState(null);
    const [username, setUsername] = useState(null)
    const [name, setName] = useState(null)
    const [type, setType] = useState(null)
    const [done, setDone] = useState('Done')
    const [disable, setDisable] = useState(true)
    const [text, setText] = useState("");
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    useEffect(() => {
        getProfile();
    }, []);

    async function getProfile() {
        try {
          setLoading(true)
          const user = supabase.auth.user()
          const { data, error, status } = await supabase
            .from('profile')
            .select(`display_name, fullname, profile_img_name`)
            .eq('id', user.id)
            .single()
            //console.log(data);
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
            setUsername(data.display_name)
            setName(data.fullname)
            setPImage(data.profile_img_name)
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
      }

      const uploadFromURI = async () => {
        setDone('Uploading, please wait...')
        setDisable(true)
            const ext = image.substring(image.lastIndexOf(".")+1);

            const fileName = image.replace(/^.*[\\\/]/, "");
            var formData = new FormData();
            formData.append("files", {
                uri: image,
                name: fileName,
                type: type ? `image/${ext}` : `video/${ext}`,
                user_name: username,
            });
            console.log(formData);
            const {data, error} = await supabase.storage
            .from("post-image")
            .upload(fileName, formData);
            

            if (error) throw new Error(error.message);

            return {imageData: data}, await uploadPost(fileName);;

            
        }


        const textFilterFunction = (text) => {
          if (text) {
            const newData = masterDataSource.filter(function (item) {
              const itemData = item.title
                ? item.title.toUpperCase()
                : ''.toUpperCase();
              const textData = text.toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setText(text);
          } else {
            setFilteredDataSource(masterDataSource);
            setText(text);
          }
        };
  


        const uploadPost = async (fname) => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                .from('post')
                .insert({post_name: fname, username: username, created_at: new Date(), profile_image: pImage, text: text})
                if(!error)
                
                navigation.navigate('Home')
                if (error) throw error
                  
              } catch (error) {
                alert(error.error_description || error.message)
              } finally {
                setLoading(false)
                
              }
        }
    

        const pickImage = async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.cancelled) {
            setImage(result.uri);
            setType(result.type);
            setDisable(false)
          }
        };

    return (
        <View style={styles.container}>
            <Header/>
            <ScrollView style={styles.content}>

      {image && <Image source={{uri: image}}
                   style={styles.uploadImg}/>}
                  
                   <Button onPress={async () =>{ const response = await pickImage();
               
                } }title={'Upload photo'}/>
      <Input placeholder={'Type some text here...'} multiline={true}
                editable
                onChangeText={(text) => textFilterFunction(text)}
                onClear={(text) => textFilterFunction('')}
                value={text}/>
      <Button disabled={disable} onPress={async () =>{uploadFromURI()} }
      title={done}/>
            </ScrollView>
             <View style={styles.footer}>
                <TouchableOpacity onPress={()=>{navigation.navigate('Home')}}>
                    <Icon style={styles.add} size={40} name='home'/>
                 </TouchableOpacity>
                 <TouchableOpacity disabled>
                     <Icon style={styles.add} reverse size={20} name='add'/>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('Search')}}>
                     <Icon style={styles.add} size={40} name='search'/>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('StartChat')}}>
                     <Icon style={styles.add} size={40} name='chat' />
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('Profile')}}>
                     <Icon style={styles.add} size={40} name='person'/>
                 </TouchableOpacity>
            </View>
        </View>       
    )
}
