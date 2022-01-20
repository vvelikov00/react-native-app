import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Platform, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { supabase } from '../src/supabaseClient'

export const HomeScreen = ({navigation, session}) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [users, setUsers] = useState([]);
    const [images, setImages] = useState([]);
    
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
            return await getImagesN(map, username);
            
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
      }


     async function getImagesN(users, user) {
        try {
          setLoading(true)
          const { data, error, status } = await supabase
            .from('post')
            .select(`post_name, username, profile_image, text`)
            .or('username.eq.'+user+', '+users.map((element) => {return 'username.eq.'+element})+'')
            .order('created_at', {ascending: false})
            const map = data.map((element) => {return element} )
            
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
            const final = map.map((element) => {
              return getImages(element.post_name, element.text, element.username, element.profile_image);
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

      const getImages = async(imgname, text, username, profile_image) => {
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
              return {data, text, username, profile_image, imgname}    
            }
          
          //setImages(map);
        }  finally {
          setLoading(false)
        }
      }

      const like = async (x, post) => {
        console.log(post)
        const { data, error } = await supabase
        .rpc('increment', { x, name: post })
      
        return data
      }
  

      function returnImages() {

        return images.map((element, i) => {
          //console.log(element)
          if (i !== images.length-1) {
            return <View style={styles.post} key={element._W.data.publicURL} >
            <View style={styles.postHeader}>
              <Image source={{uri: element._W.profile_image}} style={styles.postProfileImg}/>
              <Text style={styles.postUsername}>{element._W.username}</Text>
              </View>
              <Image  source={{uri: element._W.data.publicURL}} style={styles.postImg}/>
              <View>
              <TouchableOpacity style={{flexDirection: 'row', marginLeft: '1%'}} onPress={() => like(1, element._W.imgname)}>
                <Icon size={20} color='#e35542' name='thumb-up'/>
                <Text style={{alignSelf:'center', color:'#e35542'}} >{' Like'}</Text>
              </TouchableOpacity>
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
              <View>
              <TouchableOpacity style={{flexDirection: 'row', marginLeft: '1%'}} onPress={() => like(1, element._W.imgname)}>
                <Icon size={20} color='#e35542' name='thumb-up'/>
                <Text style={{alignSelf:'center', color:'#e35542'}} >{' Like'}</Text>
              </TouchableOpacity>
            </View>
              {element._W.text ? <View style={styles.postFooter}>
                <Text>{element._W.username+': '+ element._W.text}</Text>
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
          

              
                {returnImages()}
                 
                   
                 <Text>{'\n'}</Text>
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

  postImg: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 5,
    
  },



    
});