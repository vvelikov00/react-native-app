import React, {useEffect, useState, useRef} from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon, Input } from 'react-native-elements'
import { supabase } from '../src/supabaseClient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from '../styles/mainScreens'
 
export const ChatScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [friend, setFriend] = useState(null)
    const [width, setWidth] = useState('100%')
    const [send, setSend] = useState('none')
    const [newMessage, setNewMessage] = useState("");
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {

      const showMessages = navigation.addListener('focus', () => {
        getUsername();    
      });
   
    }, [navigation])



    useEffect(() => {
     const unSub = getMessages(user, friend).then(() => {
       return getNewMessages()
     })
     if (user !== null && friend !== null) {
      return async () => await unSub;
     }
     
    }, []);
    const getNewMessages = async () => {
        const sub = await supabase
        .from('messages')
        .on('*', async payload => {
          await getUsername();
        })
        .subscribe();
  return sub;

      }

    async function getProfile(friend) {
      try {
        setLoading(true)
        const user = supabase.auth.user()
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
            .select(`from, to, message, created_at`)
            .or('from.eq.'+user+', to.eq.'+user+'')
            .order('created_at', {ascending: true})
             const map = data.map((element) => {if (element.from === friend || element.to === friend) {return element}} )
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {

             let final = map.filter(function(element) {
              return element !== undefined
            });
            setMessages(final)
            
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
        
        
      }


      const messageFilterFunction = (text) => {
        if (text) {
          const newData = masterDataSource.filter(function (item) {
            const itemData = item.title
              ? item.title.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setNewMessage(text);
          setSend('flex')
          setWidth('90%')
        } else {
          setFilteredDataSource(masterDataSource);
          setNewMessage(text);
          setSend('none')
          setWidth('100%')
        }
      };

      async function insertMessage() {
        try {
          setLoading(true)
          const { data, error } = await supabase
          .from('messages')
          .insert({from: user.display_name, to: friend.display_name, message: newMessage, created_at: new Date()})
          if(!error)
          
          if (error) throw error
            
        } catch (error) {
          alert(error.error_description || error.message)
        } finally {
          setLoading(false)
          
        }
        
        setNewMessage('')
        setSend('none')
        setWidth('100%')
      }


      function showMessages() {
        if (messages && messages.length !== 0)
        { 
         return messages.map((element) => {
            //console.log(element)
            if (element) {
              if (element.from === user.display_name) {
               //console.log(element.from)
                return <View key={element.created_at+'u'} ><View style={{flexDirection: 'row', alignSelf: 'flex-end'}}><Text style={{ fontSize: 15, backgroundColor: 'gray', maxWidth: '80%', borderRadius: 10, paddingTop: '1%', paddingBottom: '1%', paddingLeft: '2%', paddingRight: '2%', marginBottom: '1%', marginRight: '1%'}}>{element.message}</Text>
                <Image source={{uri: user.profile_img_name}}  style={{width: '6%', height: undefined, aspectRatio: 1, alignSelf: 'center', borderRadius: 10}}/>
                </View>
                </View>
              } else {
                //console.log(element.from)
                return <View key={element.created_at+'f'}><View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                                  <Image source={{uri: friend.profile_img_name}}  style={{width: '6%', height: undefined, aspectRatio: 1, alignSelf: 'center', borderRadius: 10}}/>

                  <Text style={{ fontSize: 15, alignSelf: 'flex-start', backgroundColor: 'white', maxWidth: '80%', borderRadius: 10, paddingTop: '1%', paddingBottom: '1%', paddingLeft: '2%', paddingRight: '2%', marginBottom: '1%', marginLeft: '1%'}}>{element.message}</Text>
                
                </View>
                </View>
              }
              


            }
            
          })
        } else {
          return <Text>{'No messages'}</Text>
        }
      }


   
  
  
      const scrollViewRef = useRef();

    return (
      
        <View style={styles.container}>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => {navigation.navigate('StartChat')}}>
                    <Icon style={styles.add} size={40} name='chevron-left'/>
                 </TouchableOpacity>
            </View>
            <ScrollView style={styles.content} ref={scrollViewRef}
      onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
              {showMessages()}  
              <Text>{'\n'}</Text>
            </ScrollView>
             <View style={styles.footer}>
               <View style={{flexDirection: 'row', width: width}}>
               <Input placeholder={'Type your message here'} 
                multiline={true}
                editable
                onChangeText={(text) => messageFilterFunction(text)}
                onClear={(text) => messageFilterFunction('')}
                value={newMessage}
                />
               </View>
                <TouchableOpacity style={{display: send}} onPress={() => insertMessage()}>
                <Icon style={styles.add} size={40} name='send'/>
                </TouchableOpacity>
            </View>
        </View>
        
    )
}
