import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Platform, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { supabase } from '../src/supabaseClient'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const StartChatScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [imagesN, setImagesN] = useState([]);
    
    useEffect(() => {

          getProfile()
         
       
       
    }, [])
  
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
          return await getFriendsFromMessages(data.display_name);
          
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    async function getFriendsFromMessages(username) {
        try {
          setLoading(true)
          
          const { data, error, status } = await supabase
            .from('messages')
            .select(`from, to, message, created_at`)
            .or('from.eq.'+username+', to.eq.'+username+'')
            .order('created_at', {ascending: false})
            const map = data.map((element) => {return element} )
          
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
            let pp = map.filter( (ele, ind) => ind === map.findIndex( elem => elem.from === ele.from && elem.to === ele.to || elem.from === ele.to))

            var names = []

            map.forEach(function(item) {
              if (names.indexOf(item) === -1) {
                names.push(item);
              }
          });
          

            console.log(pp)
        
            //console.log(uniqueNames)
           return await getImages(pp, username);      
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
      }




      async function getImages(users, user) {
        try {
          setLoading(true)
          const map = users.map((element) => {
            //console.log(element)
            if (element.from === user) {
              //console.log(element.to)
              return getSingleUser(element.to, element.message, element.from, element.created_at)
            } else if (element.to === user) {
              //console.log(element.from)
              return getSingleUser(element.from, element.message, element.from, element.created_at)
            }
            
            
          })
          setTimeout(() => {

            setMessages(map)
           }, 300)
        
        } finally {
          setLoading(false)
        }
      }
  
      async function getSingleUser(username, message, from, created_at) {
        try {
          setLoading(true)
          
          const { data, error, status } = await supabase
            .from('profile')
            .select(`display_name, profile_img_name, fullname`)
            .match({display_name: username})
            .single()
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
           // setUsernames(map)
          // console.log(data)
            return {data, message, from, created_at}
           // map.map((element) => {return getUsers(element)})
            
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
      }


      async function goToChat(element) {
        AsyncStorage.setItem('@Username', JSON.stringify(element.data.display_name))

        navigation.navigate('Chat')
      }


      function showMessages() {
        if (messages) {
          return messages.map((element) => {
              //console.log(element)

              if (element) {
                  return <TouchableOpacity key={element._W.data.display_name} onPress={() => goToChat(element._W)}>
                             <View style={styles.result}  >
                                <Image source={{uri: element._W.data.profile_img_name}} style={styles.resultImg}/>
                                <View style={styles.text}>
                                    <Text style={styles.fullname}>{element._W.data.fullname}</Text>
                                    <Text style={styles.username}>{element._W.from}{': '}{element._W.message}</Text>
                                    </View>
                            </View>
                            </TouchableOpacity>
                  
              }

          })  
        }

     
    } 


  


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo} source={require('../images/SM.png')}/>
            </View>
            <ScrollView style={styles.content}>
                <TouchableOpacity style={{flexDirection: "row", justifyContent: 'space-between', marginLeft: '10%', marginRight: '10%', backgroundColor: 'white', paddingLeft: '1%', borderRadius: 20, paddingTop: '1%', paddingBottom: '1%'}}
                onPress={() => {navigation.navigate('StartNewChat')}}>
                    <Text>Start new chat</Text><Icon name='add'/>
                </TouchableOpacity>
                {showMessages()}

                
                 
                   
                 <Text>{'\n'}</Text>
            </ScrollView>
             <View style={styles.footer}>
                <TouchableOpacity onPress={() => {navigation.navigate('Home')}}>
                    <Icon style={styles.add} size={40} name='home'/>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('Add')}}>
                     <Icon style={styles.add} size={40} name='add'/>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('Search')}}>
                     <Icon style={styles.add} size={40} name='search'/>
                 </TouchableOpacity>
                 <TouchableOpacity disabled>
                     <Icon style={styles.add} size={20} name='chat' reverse/>
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
    padding: 10,
    marginBottom: '6%',
  },

  result: {
    marginTop: '2%',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 0.5,
    backgroundColor: 'white'
 },

 resultImg: {
     width: '15%',
     height: undefined,
     aspectRatio: 1,
     borderRadius: 6,
     
 },

 text: {
     marginLeft: '10%'
 },
 
 username: {
     fontSize: 15,
 },

 fullname: {
     fontSize: 25
 }




    
});