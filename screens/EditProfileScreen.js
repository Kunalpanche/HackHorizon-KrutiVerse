import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfileScreen({ navigation, route }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    designation: '',
    bio: '',
    isDoctor: false,
    photo: null,
    socialLinks: {
      instagram: '',
      linkedin: '',
      youtube: '',
    }
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.userProfile) {
      const { userProfile } = route.params;
      setFormData({
        name: userProfile.name || '',
        username: userProfile.username || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        designation: userProfile.designation || '',
        bio: userProfile.bio || '',
        isDoctor: userProfile.isDoctor || false,
        photo: userProfile.photo || null,
        socialLinks: userProfile.socialLinks || {
          instagram: '',
          linkedin: '',
          youtube: '',
        }
      });
    } else {
      loadUserProfile();
    }
  }, [route.params]);

  const loadUserProfile = async () => {
    try {
      const userProfileString = await AsyncStorage.getItem('userProfile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        setFormData({
          name: userProfile.name || '',
          username: userProfile.username || '',
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          designation: userProfile.designation || '',
          bio: userProfile.bio || '',
          isDoctor: userProfile.isDoctor || false,
          photo: userProfile.photo || null,
          socialLinks: userProfile.socialLinks || {
            instagram: '',
            linkedin: '',
            youtube: '',
          }
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photo library to change your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFormData(prev => ({ ...prev, photo: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // In a real app, you would send this data to your backend
      await AsyncStorage.setItem('userProfile', JSON.stringify(formData));
      
      Alert.alert(
        'Success', 
        'Profile updated successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.photoContainer}>
            <TouchableOpacity onPress={pickImage}>
              {formData.photo ? (
                <Image source={{ uri: formData.photo }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Feather name="camera" size={40} color="#666" />
                </View>
              )}
              <View style={styles.editIconContainer}>
                <Feather name="edit-2" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.photoText}>Tap to change photo</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={formData.username}
                onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
                placeholder="Enter your username"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Designation</Text>
              <TextInput
                style={styles.input}
                value={formData.designation}
                onChangeText={(text) => setFormData(prev => ({ ...prev, designation: text }))}
                placeholder="Enter your designation (e.g., Botany Student)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={formData.bio}
                onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Social Media Links</Text>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.socialInputContainer}>
                <FontAwesome name="instagram" size={20} color="#E1306C" style={styles.socialIcon} />
                <TextInput
                  style={styles.socialInput}
                  value={formData.socialLinks.instagram}
                  onChangeText={(text) => handleSocialLinkChange('instagram', text)}
                  placeholder="Instagram username"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.socialInputContainer}>
                <FontAwesome name="linkedin-square" size={20} color="#0077B5" style={styles.socialIcon} />
                <TextInput
                  style={styles.socialInput}
                  value={formData.socialLinks.linkedin}
                  onChangeText={(text) => handleSocialLinkChange('linkedin', text)}
                  placeholder="LinkedIn username"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.socialInputContainer}>
                <FontAwesome name="youtube-play" size={20} color="#FF0000" style={styles.socialIcon} />
                <TextInput
                  style={styles.socialInput}
                  value={formData.socialLinks.youtube}
                  onChangeText={(text) => handleSocialLinkChange('youtube', text)}
                  placeholder="YouTube channel name"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Are you a doctor or plant specialist?</Text>
              <TouchableOpacity
                style={styles.toggle}
                onPress={() => setFormData(prev => ({ ...prev, isDoctor: !prev.isDoctor }))}
              >
                <View style={[styles.toggleTrack, formData.isDoctor && styles.toggleTrackActive]}>
                  <View style={[styles.toggleDot, formData.isDoctor && styles.toggleDotActive]} />
                </View>
                <Text style={styles.toggleText}>{formData.isDoctor ? 'Yes' : 'No'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.saveButtonText}>Saving...</Text>
              ) : (
                <Text style={styles.saveButtonText}>Save Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 24,
  },
  photoContainer: {
    alignItems: 'center',
    padding: 20,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  photoText: {
    marginTop: 10,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  socialInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  socialIcon: {
    marginRight: 10,
  },
  socialInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    padding: 2,
  },
  toggleTrackActive: {
    backgroundColor: '#A5D6A7',
  },
  toggleDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#666',
  },
  toggleDotActive: {
    transform: [{ translateX: 20 }],
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});