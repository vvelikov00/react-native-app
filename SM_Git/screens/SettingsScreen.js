import React, { useEffect } from 'react'
import { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../src/supabaseClient';
import { Button } from 'react-native';
import styles from '../styles/mainScreens'
import { Header } from '../components/Header'

export const SettingsScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true)
    const [imageData, setImageData] = useState(null)
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState(null)
    const [name, setName] = useState(null)
    useEffect(() => {
        getProfile();
    }, []);

    async function getProfile() {
        try {
          setLoading(true)
          const user = supabase.auth.user()
          
          const { data, error, status } = await supabase
            .from('profile')
            .select(`display_name, fullname`)
            .eq('id', user.id)
            .single()
            //console.log(data);
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
            setUsername(data.display_name)
            setName(data.fullname)
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
      }

    const uploadFromURI = async (photo) => {
        if (!photo.cancelled) {
            const ext = photo.uri.substring(photo.uri.lastIndexOf(".")+1);

            const fileName = photo.uri.replace(/^.*[\\\/]/, "");
            var formData = new FormData();
            formData.append("files", {
                uri: photo.uri,
                name: fileName,
                type: photo.type ? `image/${ext}` : `video/${ext}`,
                user_name: username,
            });
            //console.log(formData);
            const {data, error} = await supabase.storage
            .from("profile-image")
            .upload(fileName, formData);
            

            if (error) throw new Error(error.message);

            return {...photo, imageData: data}, await updateUrl(fileName);
        }else {
            return photo;
            }
            
        }


        const updateUrl = async (fname) => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                .from('profile')
                .update({profile_img_name: "https://cntbrkgnlgsnfxjdtcky.supabase.co/storage/v1/object/public/profile-image/"+fname})
                .match({display_name: username})
                if(!error)
                
                if (error) throw error
                  
              } catch (error) {
                alert(error.error_description || error.message)
              } finally {
                setLoading(false)
                return await updateUrlPost(fname)
              }
        }

        const updateUrlPost = async (fname) => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                .from('post')
                .update({profile_image: "https://cntbrkgnlgsnfxjdtcky.supabase.co/storage/v1/object/public/profile-image/"+fname})
                .match({username: username})
                if(!error)
                
                if (error) throw error
                  
              } catch (error) {
                alert(error.error_description || error.message)
              } finally {
                setLoading(false)
                
              }
        }
    

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    try {
        return await uploadFromURI(photo);

        
    } catch (e) {
       
        return null;
    }
  };

    return (
        <View style={styles.container}>
            <Header/>
            <View style={styles.content}>
                <Button onPress={async () =>{ const response = await pickImage();
                if(response?.imageData) {
                    setImage(response.uri);
                    setImageData(response?.imageData);
                }
                } }title={'Change photo'}/>
                <Button title='Change email' onPress={() => {navigation.navigate('ChangeEmail')}}/>
                <Button title='Change username (not working fully yet)'onPress={() => {navigation.navigate('ChangeUsername')}}/>
                <Button title='Change password' onPress={() => {navigation.navigate('ChangePassword')}}/>
                <Button title='Logout' onPress={async () =>{setTimeout(() => {const { error } = supabase.auth.signOut(); navigation.navigate('Login')}, 100)}}/>
            </View>
             <View style={styles.footer}>
                <TouchableOpacity onPress={()=>{navigation.navigate('Home')}}>
                    <Icon style={styles.add} size={40} name='home'/>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('Add')}}>
                     <Icon style={styles.add} size={40} name='add'/>
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
