import React, {useEffect, useState} from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { supabase } from '../src/supabaseClient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from '../styles/mainScreens'

export const StartChatScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [imagesN, setImagesN] = useState([]);
    
    useEffect(() => {

      const showMessages = navigation.addListener('focus', () => {
        getProfile();
      });
       
    }, [navigation])
  
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
            .select(`from, to, message, created_at, seen`)
            .or('from.eq.'+username+', to.eq.'+username+'')
            .order('created_at', {ascending: false})
            const map = data.map((element) => {return element} )
          
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
            let pp = map.filter( (ele, ind) => ind === map.findIndex( elem => elem.from === ele.from && elem.to === ele.to || elem.from === ele.to && elem.to === ele.from))
            //console.log(pp)
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
            if (element.from === user) {
              return getSingleUser(element.to, element.message, element.from, element.seen, element.to)
            } else if (element.to === user) {
              return getSingleUser(element.from, element.message, element.from, element.seen, element.to)
            }
            
            
          })
          setTimeout(() => {
            setMessages(map)
           }, 300)
        
        } finally {
          setLoading(false)
        }
      }
  
      async function getSingleUser(username, message, from, seen, to) {
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
            return {data, message, from, seen, to}
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
      }


      async function goToChat(element) {
        AsyncStorage.setItem('@Username', JSON.stringify(element.data.display_name))
        if (element.from !== username && element.seen === 'no') {
          return await updateTable(element)
        } else {
          navigation.navigate('Chat')
        }
        
        //console.log(element)
      }

      async function updateTable(element) {
        try {
          setLoading(true)
          const { data, error } = await supabase
          .from('messages')
          .update({seen: "yes"})
          .match({from: element.from, to: element.to})
          if(!error)
          navigation.navigate('Chat')
          if (error) throw error
            
        } catch (error) {
          alert(error.error_description || error.message)
        } finally {
          setLoading(false)
          
        }
      }


      function showMessages() {

       // console.log(messages.length)
        if (messages && messages.length > 0) {
          return messages.map((element) => {
             // console.log(element)

              if (element) {
                  return <TouchableOpacity key={element._W.data.display_name} onPress={() => goToChat(element._W)}>
                             <View style={styles.result}  >
                                <Image source={{uri: element._W.data.profile_img_name}} style={styles.resultImg}/>
                                <View style={styles.text}>
                                    <Text style={styles.fullname}>{element._W.data.fullname}</Text>
                                    <Text style={{fontWeight: element._W.seen === 'no' ? 'bold' : 'normal', fontSize: 15 }}>{element._W.from}{': '}{element._W.message}</Text>
                                    </View>
                            </View>
                            </TouchableOpacity>
                  
              }

          })  
        } else {
          //console.log('No messages')
          return <Text style={{alignSelf: 'center'}}>{'No messages'}</Text>
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
