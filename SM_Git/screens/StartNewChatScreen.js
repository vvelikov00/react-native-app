import React, {useEffect, useState} from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { supabase } from '../src/supabaseClient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from '../styles/mainScreens'

export const StartNewChatScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [users, setUsers] = useState([]);
    
    useEffect(() => {

          getProfile()
         
       
       
    }, [])
  
    async function getProfile() {
      try {
        setLoading(true)
        const user = supabase.auth.user()
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
            .select(`friend_with`)
            .match({user: username})
            const map = data.map((element) => {return element.friend_with} )
          
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
           // setUsernames(map)
           //console.log(map)
           return await getUsers(map)
           // map.map((element) => {return getUsers(element)})
            
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
      }


      async function getUsers(users) {
        try {
          setLoading(true)
          const map = users.map((element) => {
            return getSingleUser(element)
          })
          setTimeout(() => { setUsers(map)
           // console.log(map)
           }, 300)
        
        } finally {
          setLoading(false)
        }
      }
  
      async function getSingleUser(username) {
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
            return data
           // map.map((element) => {return getUsers(element)})
            
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
      }

      async function goToChat(element) {
        AsyncStorage.setItem('@Username', JSON.stringify(element.display_name))
        navigation.navigate('Chat')
      }


      function showUsers() {
        if (users) {
          return users.map((element) => {
              //console.log(element)
              if (element) {
                  return <TouchableOpacity key={element._W.display_name} onPress={() => goToChat(element._W)}>
                             <View style={styles.result}  >
                                <Image source={{uri: element._W.profile_img_name}} style={styles.resultImg}/>
                                <View style={styles.text}>
                                    <Text style={styles.fullname}>{element._W.fullname}</Text>
                                    <Text style={styles.username}>{element._W.display_name}</Text>
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
            {showUsers()}
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
