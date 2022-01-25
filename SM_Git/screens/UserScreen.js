import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { useState, useEffect } from 'react'
import { supabase } from '../src/supabaseClient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from '../styles/allScreens'


export const UserScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [name, setName] = useState(null)
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    const [requests, setRequests] = useState([]);
    const [likes, setLikes] = useState([]);

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
          return await getRequests(data.display_name), getLikes(data.display_name);
          
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    async function getLikes(username) {
      try {
        setLoading(true)
        const { data, error, status } = await supabase
          .from('likes')
          .select(`post_name`)
          .match({from: username})
          const map = data.map((element) => {return element.post_name})
        //console.log(data);
        if (error && status !== 406) {
          throw error
        }
        
        if (data) {
          setLikes(map)
          return await getImagesN(username, map)
          
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    async function getNewLikes() {
      try {
        setLoading(true)
        const { data, error, status } = await supabase
          .from('likes')
          .select(`post_name`)
          .match({from: username})
          const map = data.map((element) => {return element.post_name})
        if (error && status !== 406) {
          throw error
        }
        
        if (data) {
          setLikes(map)
          
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    async function getImagesN(username, likess) {
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
            return getImages(element.post_name, element.text, element.likes, likess);
          })
          setTimeout(() => {
            setImages(final)
           }, 300)
          
          
          
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    const getImages = async(imgname, text, likes, likess) => {
      try {
        setLoading(true)
       
          const { data, error } = supabase.storage
          .from('post-image')
          .getPublicUrl(imgname)
          if (error) {
            throw error
          }
          
          if (data) {
            var color
            var like
          //  console.log(imgname, likess.indexOf(imgname))
            if (likess.indexOf(imgname) < 0) 
            {
              color = '#4287f5'
              like = 'Like'
            } else {
              color = '#e35542'
              like = 'Liked'
            } 

           // console.log(data) 
            return {data, text, likes, imgname, color, like}    
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

    const like = async (post) => {
      if (likes.indexOf(post._W.imgname) < 0) {
        var x = 1
        try {
          setLoading(true)
          const { data, error } = await supabase
          .from('likes')
          .insert({post_name: post._W.imgname, from: username, created_at: new Date()})
          if(!error) {
            const { data, error } = await supabase
            .rpc('increment', { x, name: post._W.imgname })
            post._W.likes = post._W.likes+1
            post._W.color = '#e35542'
            post._W.like = 'Liked'
            return data, post._W.likes, post._W.color, post._W.like, getNewLikes()
          }
  
  
          
          if (error) throw error
            
        } catch (error) {
          alert(error.error_description || error.message)
        } finally {
          setLoading(false)
          
        }

      } else {
        var x = -1
        try {
          setLoading(true)
          const { data, error } = await supabase
          .from('likes')
          .delete()
          .match({post_name: post._W.imgname, from: username})
          if(!error) {
            const { data, error } = await supabase
            .rpc('increment', { x, name: post._W.imgname })
        
            post._W.likes = post._W.likes-1
            post._W.color = '#4287f5'
            post._W.like = 'Like'
            return data, post._W.likes, post._W.color, post._W.like, getNewLikes()
          }
  
  
          
          if (error) throw error
            
        } catch (error) {
          alert(error.error_description || error.message)
        } finally {
          setLoading(false)
          
        }
      }


     /* const { data, error } = await supabase
      .rpc('increment', { x, name: post })
    
      return data*/
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
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={{flexDirection: 'row', marginLeft: '1%', alignSelf: 'flex-start'}} onPress={() => like(element)}>
                <Icon size={20} color = {element._W.color} name='thumb-up'/>
                <Text style={{alignSelf:'center', color:element._W.color }} >{' '+element._W.like}</Text>
              </TouchableOpacity>

              <View style={{flexDirection: 'row', marginRight:'1%'}}>
              <Icon size={20} name='thumb-up'/>
              <Text style={{alignSelf:'center'}}>{' '+element._W.likes}</Text>
              </View>
            
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
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <TouchableOpacity style={{flexDirection: 'row', marginLeft: '1%'}} onPress={() => like(element)}>
                <Icon size={20} color = {element._W.color} name='thumb-up'/>
                <Text style={{alignSelf:'center', color:element._W.color }} >{' '+element._W.like}</Text>
              </TouchableOpacity>
              <View style={{flexDirection: 'row', marginRight:'1%'}}>
              <Icon size={20} name='thumb-up'/>
              <Text style={{alignSelf:'center'}}>{' '+element._W.likes}</Text>
              </View>
              </View>
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
