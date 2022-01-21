import React from 'react'
import { View, Text, StyleSheet, Platform, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { useState, useEffect } from 'react'
import { supabase } from '../src/supabaseClient'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const ProfileScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [user, setUser] = useState(null)
    const [disable, setDisable] = useState(false)
    const [friends, setFriends] = useState('Accept')
    const [color, setColor] = useState('dodgerblue')
    const [text, setText] = useState('Add Friend')
    const [addfriend, setAddfriend] = useState('flex')
    const [accept, setAccept] = useState('none')
    const [cancel, setCancel] = useState('none')
    const [name, setName] = useState(null)
    const [image, setImage] = useState(null);
    const [img, setImg] = useState(null);
    const [images, setImages] = useState([]);
    const [likes, setLikes] = useState([]);
    useEffect(() => {
      const showProfile = navigation.addListener('focus', () => {
        getUsername();
      });
        
    }, [navigation])
  
    async function getUsername() {
        let value = await AsyncStorage.getItem('@Username')
        let parsed = JSON.parse(value)
        let userJ = await AsyncStorage.getItem('@User')
        let userD = JSON.parse(userJ)
        setUsername(parsed)
        setUser(userD)
        getProfile(parsed, userD)
        getRequest(parsed, userD)
        getRequestTo(parsed, userD)
        getFriend(parsed, userD)
        getImg(userD)
    }

    async function getImg(user) {
      try {
        setLoading(true)
        const { data, error, status } = await supabase
          .from('profile')
          .select(`profile_img_name`)
          .match({display_name: user})
          .single()
          
        if (error && status !== 406) {
          throw error
        }
        
        if (data) {
         setImg(data.profile_img_name)
         
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
        
      }
    }


    async function getFriend(username, user) {
      try {
        setLoading(true)
        const { data, error, status } = await supabase
          .from('friends')
          .select(`user, friend_with`)
          .match({user: user, friend_with: username})
          .single()
        if (error && status !== 406) {
          throw error
        }
        
        if (data) {
          //console.log(user)
 
              setAddfriend('none')
              setAccept('flex')
              setFriends('Friends')
              

         
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
        
      }
    }

    async function getRequest(username, user) {
      try {
        setLoading(true)
        const { data, error, status } = await supabase
          .from('requests')
          .select(`to`)
          .match({to: username, from: user})
          .single()
          
        if (error && status !== 406) {
          throw error
        }
        
        if (data) {
         setColor('gray')
         setText('Cancel request')
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
        
      }
    }


    async function getRequestTo(username, user) {
      try {
        setLoading(true)
        const { data, error, status } = await supabase
          .from('requests')
          .select(`to`)
          .match({to: user, from: username})
          .single()
          
        if (error && status !== 406) {
          throw error
        }
        
        if (data) {
          setAddfriend('none')
          setAccept('flex')
          setCancel('flex')
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
        
      }
    }


    async function getProfile(username, user) {
      try {
        setLoading(true)     
        const { data, error, status } = await supabase
          .from('profile')
          .select(`fullname, profile_img_name`)
          .eq('display_name', username)
          .single()
          //console.log(data)
        if (error && status !== 406) {
          throw error
        }
        
        if (data) {
          setName(data.fullname)
          setImage(data.profile_img_name)
          return await getLikes(username, user);
          
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }


    async function getLikes(username, user) {
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
          console.log(map)
          return await getImagesN(username,  map)
          
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
          .match({from: user})
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


    

    async function getImagesN(username,  likess) {
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
            //console.log(likess)
           // console.log(element.post_name, element.text, element.likes, likess)
            return getImages(element.post_name, element.text, element.likes, likess);
          })
          setTimeout(() => {
           console.log(final)
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
           // console.log(data)
           var color
           var like
           console.log(imgname, likess.indexOf(imgname))
           if (likess.indexOf(imgname) < 0) 
           {
             color = '#4287f5'
             like = 'Like'
           } else {
             color = '#e35542'
             like = 'Liked'
           }  
            return {data, text, likes, imgname, color, like}    
          }
        
        //setImages(map);
      }  finally {
        setLoading(false)
      }
    }


    const sendRequest = async () => {

      if (text === 'Add Friend') {
        try {
          setLoading(true)
          const { data, error } = await supabase
          .from('requests')
          .insert({from: user, to: username, profile_image: img})
          if(!error)
          
          if (error) throw error
            
        } catch (error) {
          alert(error.error_description || error.message)
        } finally {
          setLoading(false)
          
        }

        
        setColor('gray')
        setText('Cancel request')
      } else if (text === 'Cancel request') {
        try {
          setLoading(true)
          const { data, error } = await supabase
          .from('requests')
          .delete()
          .match({from: user, to: username})
          if(!error)
          
          if (error) throw error
            
        } catch (error) {
          alert(error.error_description || error.message)
        } finally {
          setLoading(false)
          
        }

        
        setColor('dodgerblue')
        setText('Add friend')
      }
      
        
  }

  const cancelRequest = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
      .from('requests')
      .delete()
      .match({to: user, from: username})
      if(!error)
      
      if (error) throw error
        
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
      
    }


    
    
      
}

const acceptRequest = async () => {
  try {
    setLoading(true)
    const { data, error } = await supabase
    .from('friends')
    .insert({user: user, friend_with: username, created_at: new Date()})
    if(!error)
    
    if (error) throw error
      
  } catch (error) {
    alert(error.error_description || error.message)
  } finally {
    setLoading(false)
    return acceptRequestC()
  }
  
    
}


const acceptRequestC = async () => {
  try {
    setLoading(true)
    const { data, error } = await supabase
    .from('friends')
    .insert({user: username, friend_with: user, created_at: new Date()})
    if(!error)
    
    if (error) throw error
      
  } catch (error) {
    alert(error.error_description || error.message)
  } finally {
    setLoading(false)
    return cancelRequest()
  }
  
    
}

const like = async (post) => {
  console.log()
  if (likes.indexOf(post._W.imgname) < 0) {
    var x = 1
    try {
      setLoading(true)
      const { data, error } = await supabase
      .from('likes')
      .insert({post_name: post._W.imgname, from: user, created_at: new Date()})
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
      .match({post_name: post._W.imgname, from: user})
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



     function returnImages() {
      return images.map((element, i) => {
       // console.log(element)
        if (i !== images.length-1) {
          return <View style={styles.post} key={element._W.data.publicURL} >
          <View style={styles.postHeader}>
            <Image source={{uri: image}} style={styles.postProfileImg}/>
            <Text style={styles.postUsername}>{username}</Text>
            </View>
            <Image  source={{uri: element._W.data.publicURL}} style={styles.postImg}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity style={{flexDirection: 'row', marginLeft: '1%'}} onPress={() => like(element)}>
                <Icon size={20} color={element._W.color} name='thumb-up'/>
                <Text style={{alignSelf:'center', color:element._W.color}} >{' '+element._W.like}</Text>
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
                <Icon size={20} color={element._W.color} name='thumb-up'/>
                <Text style={{alignSelf:'center', color:element._W.color}} >{' '+element._W.like}</Text>
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
                  <TouchableOpacity style={{backgroundColor: color, borderRadius: 2, width: '100%', alignItems: 'center', marginTop: '1%', marginBottom: '1%', display: addfriend}}  onPress={() => {sendRequest()}}>
                    <Text style={{fontSize: 15, marginBottom: '1%', marginTop: '1%'}}>{text}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{backgroundColor: 'dodgerblue', borderRadius: 2, width: '100%', alignItems: 'center', marginTop: '1%', marginBottom: '1%', display: accept}}  disabled={disable} onPress={() => {acceptRequest(), setFriends('Friends'), setDisable(true), setCancel('none')}}>
                    <Text style={{fontSize: 15, marginBottom: '1%', marginTop: '1%'}}>{friends}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{backgroundColor: 'gray', borderRadius: 2, width: '100%', alignItems: 'center', marginTop: '1%', marginBottom: '1%', display: cancel}}  onPress={() => {cancelRequest(), setAddfriend('flex'),
    setCancel('none'),
    setAccept('none')}}>
                    <Text style={{fontSize: 15, marginBottom: '1%', marginTop: '1%'}}>Cancel</Text>
                  </TouchableOpacity>
              </View>
               
                {returnImages()}
                 
                   
                 <Text>{'\n'}</Text>
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
                 <TouchableOpacity onPress={()=>{navigation.navigate('Profile')}}>
                     <Icon style={styles.add} size={40}  name='person'/>
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
    backgroundColor: 'white'
  },

  lastPost: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 6,
    backgroundColor: 'white',
    marginBottom: '6%'
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

  addFriend: {
    width: "100%",
    alignItems: 'center',
    marginBottom: '1%',
    borderRadius: 5
  }


    
});