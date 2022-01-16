import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Platform, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon, Input } from 'react-native-elements'
import { supabase } from '../src/supabaseClient'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const ChatScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [friend, setFriend] = useState(null)
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {

      const showMessages = navigation.addListener('focus', () => {
        getUsername();
      });
          
         
       
       
    }, [navigation])
  
    async function getProfile(friend) {
      try {
        setLoading(true)
        const user = supabase.auth.user()
        //console.log(supabase.auth.session())
        const { data, error, status } = await supabase
          .from('profile')
          .select(`display_name, profile_img_name, fullname`)
          .eq('id', user.id)
          .single()
        
        if (error && status !== 406) {
          throw error
        }
        
        if (data) {
          setUser(data) 
          return await getMessages(data.display_name, friend) 
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    async function getUsername() {
      let value = await AsyncStorage.getItem('@Username')
      let parsed = JSON.parse(value)
     // setUsername(parsed)
      getFriend(parsed)
      getProfile(parsed)
  }

    async function getFriend(username) {
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
            setFriend(data)
            //console.log(data)
           // return await getImagesN(map, username);
            
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
      }


      async function getMessages(user, friend) {
        try {
          setLoading(true)     
          const { data, error, status } = await supabase
            .from('messages')
            .select(`from, to, message`)
            .or('from.eq.'+user+', to.eq.'+user+'')
             const map = data.map((element) => {if (element.from === friend || element.to === friend) {return element}} )
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
           // console.log(friend)
            //console.log(map)

             let final = map.filter(function(element) {
              return element !== undefined
            });
            setMessages(final)
           // return await getImagesN(map, username);
            
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
        
        
      }



      function showMessages() {
        if (messages && messages.length !== 0)
        { 
          return <Text>{'Message'}</Text>
        } else {
          return <Text>{'No messages'}</Text>
        }
      }



  


    return (
        <View style={styles.container}>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => {navigation.navigate('StartChat')}}>
                    <Icon style={styles.add} size={40} name='chevron-left'/>
                 </TouchableOpacity>
            </View>
            <ScrollView style={styles.content}>
              {showMessages()}  

              
                
                 
                   
                 <Text>{'\n'}</Text>
            </ScrollView>
             <View style={styles.footer}>
               <Input placeholder={'Type your message here'}/>
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
        height: "9%",
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: "row",
        justifyContent: 'space-between',
    },

   logo:{
       width: "100%",
       height: "100%",
   },



   content: {
    padding: 10,
    marginBottom: '6%',
  },




    
});
