import React, { useEffect } from 'react'
import { useState } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon, Input } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../src/supabaseClient';
import { Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export const AddScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true)
    const [image, setImage] = useState(null);
    const [pImage, setPImage] = useState(null);
    const [username, setUsername] = useState(null)
    const [name, setName] = useState(null)
    const [type, setType] = useState(null)
    const [done, setDone] = useState('Done')
    const [disable, setDisable] = useState(true)
    const [selectedValue, setSelectedValue] = useState("Photo");
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

            return {imageData: data}, await updatePost(fileName);;

            
        }


        const updatePost = async (fname) => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                .from('post')
                .insert({post_name: fname, username: username, created_at: new Date(), profile_image: pImage})
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
          // No permissions request is necessary for launching the image library
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
      
          //console.log(result);
      
          if (!result.cancelled) {
            setImage(result.uri);
            setType(result.type);
            //console.log(type);
            setDisable(false)
          }
        };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                
                <Image style={styles.logo} source={require('../images/SM.png')}/>
            </View>
            <ScrollView style={styles.content}>
            <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: "100%", alignSelf: 'center' }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Photo" value="photo"/>
        <Picker.Item label="Text" value="text" />
      </Picker>
      {image && <Image source={{uri: image}}
                   style={styles.profileImg}/>}
                  
                   <Button onPress={async () =>{ const response = await pickImage();
               
                } }title={'Upload photo'}/>
      <Input placeholder={'Type some text here...(not working yet)'}/>
      <Button disabled={disable} onPress={async () =>{uploadFromURI()} }
      title={done}/>
                <Text>{'\n'}</Text>
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },

    header: {
        width: "100%",
        height: "6%",
        alignItems: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
    },

    footer: {
        paddingLeft: '1%',
        paddingRight: '1%',
        position: 'absolute', 
        left: 0, 
        right: 0, 
        bottom: 0,
        width: "100%",
        height: "6%",
        alignItems: 'center',
        
        
        backgroundColor: '#fff',
        flexDirection: "row",
        justifyContent: 'space-between',
        
    },

   logo:{
       width: "100%",
       height: "100%",
   },

   add: {
       alignSelf:'center',
       
   },

   content: {
       paddingLeft: 10,
       paddingRight: 10,
       marginBottom: '6%',
   },

   profileImg: {
     width: "90%",
     height: undefined,
     aspectRatio: 1,
     alignSelf: 'center',
     marginBottom: '2%',

   }

    
});