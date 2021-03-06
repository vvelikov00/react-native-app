import React, {useEffect, useState} from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { supabase } from '../src/supabaseClient'
import styles from '../styles/mainScreens'
import { Header } from '../components/Header'

export const HomeScreen = ({navigation, session}) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [users, setUsers] = useState([]);
    const [images, setImages] = useState([]);
    const [likes, setLikes] = useState([]);
    
    useEffect(() => {


      const showPosts = navigation.addListener('focus', () => {
        getProfile();
      });
  
          
         
       
       
    }, [navigation, session])
  
    async function getProfile() {
      try {
        setLoading(true)
        const user = supabase.auth.user()
        //console.log(supabase.auth.session())
        const { data, error, status } = await supabase
          .from('profile')
          .select(`display_name`)
          .eq('id', user.id)
          .single()
        
        if (error && status !== 406) {
          throw error
        }
        
        if (data) {
          setUsername(data.display_name)
          return await getFriends(data.display_name);
          
        }
      } catch (error) {
       alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    async function getFriends(username) {
        try {
          setLoading(true)
          
          const { data, error, status } = await supabase
            .from('friends')
            .select(`user, friend_with`)
            .match({user: username})
            const map = data.map((element) => {return element.friend_with} )
          
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
            setUsers(map)
            //console.log(users)
            return await getLikes(map, username);
            
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
      }


      
    async function getLikes(friends, user) {
      try {
        setLoading(true)
        const { data, error, status } = await supabase
          .from('likes')
          .select(`post_name`)
          .match({from: user})
          const map = data.map((element) => {return element.post_name})
        //console.log(data);
        if (error && status !== 406) {
          throw error
        }
        
        if (data) {
          setLikes(map)
         // console.log(map)
          return await getImagesN(user, map, friends)
          
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
        //console.log(data);
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


     async function getImagesN(user, likess, users) {
       if (users.length > 0) {
        try {
          setLoading(true)
          const { data, error, status } = await supabase
            .from('post')
            .select(`post_name, username, profile_image, text, likes`)
            .or('username.eq.'+user+', '+users.map((element) => {return 'username.eq.'+element})+'')
            .order('created_at', {ascending: false})
            const map = data.map((element) => {return element} )
            
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
            const final = map.map((element) => {
              return getImages(element.post_name, element.text, element.username, element.profile_image, element.likes, likess);
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
       } else {
        try {
          setLoading(true)
          const { data, error, status } = await supabase
            .from('post')
            .select(`post_name, username, profile_image, text, likes`)
            .match({username: user})
            .order('created_at', {ascending: false})
            const map = data.map((element) => {return element} )
            
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
            const final = map.map((element) => {
              return getImages(element.post_name, element.text, element.username, element.profile_image, element.likes, likess);
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

      }

      const getImages = async(imgname, text, username, profile_image, likes, likess) => {
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
             data, text, likes, imgname, color, like
              return {data, text, username, profile_image, imgname, likes, color, like}    
            }
          
          //setImages(map);
        }  finally {
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
           // alert(error.error_description || error.message)
          } finally {
            setLoading(false)
            
          }
        }
      }
  

      function returnImages() {
        if (images.length > 0) {
          return images.map((element, i) => {
            //console.log(element)
            if (i !== images.length-1) {
              return <View style={styles.post} key={element._W.data.publicURL} >
              <View style={styles.postHeader}>
                <Image source={{uri: element._W.profile_image}} style={styles.postProfileImg}/>
                <Text style={styles.postUsername}>{element._W.username}</Text>
                </View>
                <Image  source={{uri: element._W.data.publicURL}} style={styles.postImg}/>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity style={{flexDirection: 'row', marginLeft: '1%'}} onPress={() => like(element)}>
                  <Icon size={20} color={element._W.color} name='thumb-up'/>
                  <Text style={{alignSelf:'center', color: element._W.color}} >{' '+element._W.like}</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', marginRight:'1%'}}>
                <Icon size={20} name='thumb-up'/>
                <Text style={{alignSelf:'center'}}>{' '+element._W.likes}</Text>
                </View>
              </View>
                {element._W.text ? <View style={styles.postFooter}>
                  <Text>{element._W.username+': '+ element._W.text}</Text>
                </View>: undefined}
                </View>
            } else {
              return <View style={styles.lastPost} key={element._W.data.publicURL} >
              <View style={styles.postHeader}>
                <Image source={{uri: element._W.profile_image}} style={styles.postProfileImg}/>
                <Text style={styles.postUsername}>{element._W.username}</Text>
                </View>
                <Image  source={{uri: element._W.data.publicURL}} style={styles.postImg}/>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity style={{flexDirection: 'row', marginLeft: '1%'}} onPress={() => like(element)}>
                  <Icon size={20} color={element._W.color} name='thumb-up'/>
                  <Text style={{alignSelf:'center', color: element._W.color}} >{' '+element._W.like}</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', marginRight:'1%'}}>
                <Icon size={20} name='thumb-up'/>
                <Text style={{alignSelf:'center'}}>{' '+element._W.likes}</Text>
                </View>
              </View>
                {element._W.text ? <View style={styles.postFooter}>
                  <Text>{element._W.username+': '+ element._W.text}</Text>
                </View>: undefined}
                </View>
            }
    
          })
        }


       
      } 
  


    return (
        <View style={styles.container}>
          {/*  <View style={styles.header}>
                <Image style={styles.logo} source={require('../images/SM.png')}/>
            </View>*/}
            <Header/>
            <ScrollView style={styles.content}>
                {returnImages()}
            </ScrollView>
             <View style={styles.footer}>
                <TouchableOpacity disabled>
                    <Icon style={styles.add} size={20} name='home' reverse/>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('Add')}}>
                     <Icon style={styles.add} size={40} name='add'/>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('Search')}}>
                     <Icon style={styles.add} size={40} name='search'/>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('StartChat')}}>
                     <Icon style={styles.add} size={40} name='chat'/>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('Profile')}}>
                     <Icon style={styles.add} size={40} name='person'/>
                 </TouchableOpacity>


            </View>
        </View>
        
    )
}


