import React, { useEffect } from 'react'
import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Icon, SearchBar } from 'react-native-elements'
import { supabase } from '../src/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from '../styles/mainScreens'


export const SearchScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [name, setName] = useState(null)
    const [search, setSearch] = useState("");
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getProfile();
        fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson);
        setMasterDataSource(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
    }, []);


    

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource
          // Update FilteredDataSource
          const newData = masterDataSource.filter(function (item) {
            const itemData = item.title
              ? item.title.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
          console.log(text);
          return getUserProfile(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setFilteredDataSource(masterDataSource);
          setSearch(text);
          return getUserProfile(text);
        }
      };

    async function getProfile() {
        try {
          setLoading(true)
          const user = supabase.auth.user()
          
          const { data, error, status } = await supabase
            .from('profile')
            .select(`display_name, fullname`)
            .eq('id', user.id)
            .single()
            //console.log(data);
          if (error && status !== 406) {
            throw error
          }
          
          if (data) {
            setUsername(data.display_name),
            setName(data.fullname)
          }
        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
      }

      async function getUserProfile(text) {
        try {
          setLoading(true)
          
          const { data, error, status } = await supabase
            .from('profile')
            .select(`display_name, fullname, profile_img_name`)
            .like('display_name', text+'%')
            //console.log(data);
          if (error && status !== 406) {
            throw error
          }
          
          if (text) {
            if (data) {
                setUsers(data)
                //console.log(data)
              }
          } else {
              setUsers()
          }

        } catch (error) {
          alert(error.message)
        } finally {
          setLoading(false)
        }
      }

      async function goToNextPage(element) {
        AsyncStorage.setItem('@Username', JSON.stringify(element.display_name))
        AsyncStorage.setItem('@User', JSON.stringify(username))
        if (element.display_name === username) {
          navigation.navigate('Profile')
        } else {
          navigation.navigate('OtherUser')
        }
      }

      


      function showUsers() {
        if (users) {
          return users.map((element) => {
              //console.log(element)
              if (element) {
                  return <TouchableOpacity key={element.display_name} onPress={() => {goToNextPage(element)}}>
                             <View style={styles.result}  >
                                <Image source={{uri: element.profile_img_name}} style={styles.resultImg}/>
                                <View style={styles.text}>
                                    <Text style={styles.fullname}>{element.fullname}</Text>
                                    <Text style={styles.username}>{element.display_name}</Text>
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
            <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction('')}
          placeholder="Type username..."
          value={search}
        />
        {showUsers()}
            </ScrollView>
             <View style={styles.footer}>
                <TouchableOpacity onPress={()=>{navigation.navigate('Home')}}>
                    <Icon style={styles.add} size={40} name='home'/>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('Add')}}>
                     <Icon style={styles.add} size={40} name='add'/>
                 </TouchableOpacity>
                 <TouchableOpacity disabled>
                     <Icon style={styles.add} reverse size={20} name='search'/>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('StartChat')}}>
                     <Icon style={styles.add} size={40} name='chat' />
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{navigation.navigate('Profile')}}>
                     <Icon style={styles.add} size={40} name='person'/>
                 </TouchableOpacity>
            </View>
        </View>
        
    )
}
