import React from 'react'
import { View, Text, StyleSheet, Platform, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { useState, useEffect } from 'react'
import { supabase } from '../src/supabaseClient'
import AsyncStorage from '@react-native-async-storage/async-storage'



export const UserScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [name, setName] = useState(null)
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    const [requests, setRequests] = useState([]);
    useEffect(() => {
      getProfile()
      
    }, [])
  
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
          setImage(data.profile_img_name)
          return await getImagesN(data.display_name), getRequests(data.display_name);
          
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    async function getImagesN(username) {
      try {
        setLoading(true)
        const { data, error, status } = await supabase
          .from('post')
          .select(`post_name, text, likes`)
          .match({username: username})
          .order('created_at', {ascending: false})
          const map = data.map((element) => {return element} )
          
        if (error && status !== 406) {
          throw error
        }
        
        if (data) {
          const final = map.map((element) => {
            return getImages(element.post_name, element.text, element.likes);
          })
          setTimeout(() => {
           // console.log(final)
            setImages(final)
           }, 300)
          
          
          
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    const getImages = async(imgname, text, likes) => {
      try {
        setLoading(true)
       
          const { data, error } = supabase.storage
          .from('post-image')
          .getPublicUrl(imgname)
          if (error) {
            throw error
          }
          
          if (data) {
           // console.log(data) 
            return {data, text, likes, imgname}    
          }
        
        //setImages(map);
      }  finally {
        setLoading(false)
      }
    }


    async function getRequests(username) {
      try {
        setLoading(true)
        const { data, error, status } = await supabase
          .from('requests')
          .select(`from, profile_image`)
          .match({to: username})
          const map = data.map((element) => {return element} )
          
        if (error && status !== 406) {
          throw error
        }
        
        if (data) {
          setRequests(map)
          //console.log(map)
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
        
      }
    }

    const like = async (x, post) => {
      console.log(post)
      const { data, error } = await supabase
      .rpc('increment', { x, name: post })
    
      return data
    }


    async function goToNotifications() {
      AsyncStorage.setItem('@Users', JSON.stringify(requests))
      AsyncStorage.setItem('@User', JSON.stringify(username))
      navigation.navigate('Notification')
    }

     function returnImages() {
       
      return images.map((element, i) => {
        //console.log(element)
        if (i !== images.length-1) {
          return <View style={styles.post} key={element._W.data.publicURL} >
          <View style={styles.postHeader}>
            <Image source={{uri: image}} style={styles.postProfileImg}/>
            <Text style={styles.postUsername}>{username}</Text>
            </View>

            <Image  source={{uri: element._W.data.publicURL}} style={styles.postImg}/>
            <View>
              <TouchableOpacity style={{flexDirection: 'row', marginLeft: '1%'}} onPress={() => like(1, element._W.imgname)}>
                <Icon size={20} color='#e35542' name='thumb-up'/>
                <Text style={{alignSelf:'center', color:'#e35542'}} >{' Like'}</Text>
              </TouchableOpacity>
            </View>
            {element._W.text ? <View style={styles.postFooter}>
              <Text>{username+': '+ element._W.text}</Text>
            </View>: undefined}
            </View>
        } else {
          return <View style={styles.lastPost} key={element._W.data.publicURL} >
          <View style={styles.postHeader}>
            <Image source={{uri: image}} style={styles.postProfileImg}/>
            <Text style={styles.postUsername}>{username}</Text>
            </View>
            <Image  source={{uri: element._W.data.publicURL}} style={styles.postImg}/>
            {element._W.text ? <View style={styles.postFooter}>
              <Text>{username+': '+ element._W.text}</Text>
            </View>: undefined}
            </View>
        }

      })
     
    } 

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo} source={require('../images/SM.png')}/>
            </View>
            <ScrollView style={styles.content}>
          
              <View style={styles.profile}>
              <Image source={{uri: image}}
                   style={styles.profileImg}/>
                     <Text style={{fontSize: 30}}>{name}</Text>
                  <Text style={{fontSize: 15}}>{username}</Text>
              </View>
              <TouchableOpacity  style={{position: 'absolute', zIndex: 99, right: 0, paddingTop: 10, paddingRight: 10}} onPress={()=>{navigation.navigate('Settings')}}>
                     <Icon style={styles.add} size={40} name='settings' />
                 </TouchableOpacity>
                 <TouchableOpacity  style={{position: 'absolute', zIndex: 99, right: 0, backgroundColor: 'dodgerblue', alignContent: 'center', justifyContent: 'center', borderRadius: 50, marginTop: 12, marginRight: 60, paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10}} 
                 onPress={() => {goToNotifications()}}>
                     <Text style={{fontSize: 20}}>{requests.length}</Text>
                 </TouchableOpacity>
                {returnImages()}
                 
                   
                 <Text>{'\n\n\n\n'}</Text>
            </ScrollView>
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
                 <TouchableOpacity disabled>
                     <Icon style={styles.add} size={20} reverse name='person'/>
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
     padding: 10,
   },

   profile: {
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
   },

   profileImg: {
     width: 100,
     height: 100,
     borderRadius: 20,
   },

   postImg: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 5,
    
  },

  post: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 6,
    backgroundColor: 'white',

  },

  lastPost: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 6,
    backgroundColor: 'white',
    marginBottom: '7%'
  },

  postHeader: {
    flexDirection: 'row',
    
  },

  postProfileImg: {
    width:'10%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: '1%',
    marginTop: '1%',
    borderRadius: 10,
    marginLeft: '3%', 
  },

  postUsername: {
    alignSelf: 'center',
    marginLeft: '5%',
    fontSize: 15
  }, 



    
});