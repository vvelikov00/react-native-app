import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Platform, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { supabase } from '../src/supabaseClient'

export const StartChatScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [users, setUsers] = useState([]);
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
            .select(`post_name, username, profile_image`)
            .or('username.eq.'+user+', '+users.map((element) => {return 'username.eq.'+element})+'')
            .order('created_at', {ascending: false})
            const map = data.map((element) => {return element} )
            
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
           // console.log(map);
            setImagesN(map);
            
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
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




    
});