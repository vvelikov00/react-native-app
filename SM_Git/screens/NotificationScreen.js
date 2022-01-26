import React, {useEffect, useState} from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from '../styles/mainScreens'
import { Header } from '../components/Header'


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
               <Image source={{uri: element.profile_image}} style={styles.resultImg}/>
               <View style={styles.text}>
                   <Text style={styles.username}>{element.from}</Text>
                   </View>
           </View>
           </TouchableOpacity>
        })

    }

    return (
        <View style={styles.container}>
            <Header/>
            <ScrollView style={styles.content}>      
               {mapRequests()}
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
