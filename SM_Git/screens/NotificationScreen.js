import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Platform, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage'




export const NotificationScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true)
    const [requests, setRequests] = useState([])
    const [users, setUsers] = useState([])
    const [name, setName] = useState(null)
    const [image, setImage] = useState(null);

    useEffect(() => {
        getUsers()
    }, [])
    
    async function getUsers() {
        let value = await AsyncStorage.getItem('@Users')
        let parsed = JSON.parse(value)
        setRequests(parsed)
        //mapRequests(parsed)
        //console.log(parsed)
    }

    async function goToNextPage(element) {
        AsyncStorage.setItem('@Username', JSON.stringify(element.from))
        {navigation.navigate('OtherUser')}
      }

    function mapRequests(){
        return requests.map((element) => {
            return <TouchableOpacity key={element.from}  onPress={() => {goToNextPage(element)}}>
            <View style={styles.result}  >
               <Image source={{uri: element.profile_image}} style={styles.friendImg}/>
               <View style={styles.text}>
                   <Text style={styles.username}>{element.from}</Text>
                   </View>
           </View>
           </TouchableOpacity>
        })

    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo} source={require('../images/SM.png')}/>
            </View>
            <ScrollView style={styles.content}>
          
               {mapRequests()}
             
               
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
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: '6%',
},

   friendImg: {
    width: '15%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 6,
    
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

    text: {
     marginLeft: '10%'
    },

    username: {
     fontSize: 15,
    },


    
});