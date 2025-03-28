import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  Text,
  Platform,
  StatusBar
} from 'react-native';
import { Feather, FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

// Import components
import ProfileHeader from '../components/ProfileHeader';
import EnhancedStreakDashboard from '../components/EnhancedStreakDashboard';
import QuizRewards from '../components/QuizRewards';
import AchievementCard from '../components/AchievementCard';

// Mock data for global rankings
const GLOBAL_RANKINGS = [
  { id: 1, name: 'Shri Shinde', score: 12543, avatar: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Neymaar Jr', score: 11348, avatar: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Rahul G', score: 10833, avatar: 'https://via.placeholder.com/50' },
];

// Mock achievements data
const ACHIEVEMENTS = [
  {
    id: 1,
    title: 'Plant Master',
    description: 'Identified 50 plants',
    image: 'https://i.pinimg.com/736x/94/b7/4e/94b74e4c6e251171522e7f74684b4205.jpg',
    color: '#FFD700'
  },
  {
    id: 2,
    title: 'Herbal Guru',
    description: 'Learned about 25 medicinal plants',
    image: 'https://i.pinimg.com/736x/5b/32/b8/5b32b871391bb2a4990fb952143cd08c.jpg',
    color: '#4CAF50'
  },
  {
    id: 3,
    title: 'Quiz Whiz',
    description: 'Completed 10 quizzes with perfect score',
    image: 'https://i.pinimg.com/736x/39/5e/18/395e18b677bddca587a1fb0abf72aa19.jpg',
    color: '#2196F3'
  },
  {
    id: 4,
    title: 'Daily Visitor',
    description: '7-day streak',
    image: 'https://i.pinimg.com/736x/df/47/8c/df478c41460a5f0200459702cbca2547.jpg',
    color: '#FF9800'
  },
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('achievements');
  const [streakData, setStreakData] = useState({
    currentStreak: 7,
    totalPoints: 850,
    quizzesTaken: 12,
  });
  
  const [userProfile, setUserProfile] = useState({
    name: 'Kunal Panche',
    username: '@kunalpanche',
    email: 'kunalpanche34@gmail.com',
    photo: 'https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg',  // Using a reliable placeholder image service
    bio: 'Passionate about herbal plants and their medicinal properties. Learning and sharing knowledge about nature.',
    designation: 'Botany Enthusiast',
    socialLinks: {
      instagram: 'kunalpanche',
      linkedin: 'kunalpanche',
      youtube: 'HerbalKnowledge'
    },
    level: 'Apprentice',
    rank: 4,
    score: 16
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // In a real app, you would fetch this data from your backend or AsyncStorage
      const streakDataString = await AsyncStorage.getItem('streakData');
      const userProfileString = await AsyncStorage.getItem('userProfile');
      
      if (streakDataString) {
        setStreakData(JSON.parse(streakDataString));
      }
      
      if (userProfileString) {
        setUserProfile(JSON.parse(userProfileString));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.setItem("isLoggedIn", "false");
      navigation.reset({
        index: 0,
        routes: [{ name: "AuthScreen" }],
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userProfile });
  };

  const openSocialLink = (platform, username) => {
    let url;
    switch (platform) {
      case 'instagram':
        url = `https://www.instagram.com/kunalll_06/${username}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/in/kunal-panche/${username}`;
        break;
      case 'youtube':
        url = `https://www.youtube.com/@kunalpanche9979${username}`;
        break;
      default:
        return;
    }
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'achievements':
        return (
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>Your Achievements</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
              {ACHIEVEMENTS.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </ScrollView>
            
            <QuizRewards totalPoints={streakData.totalPoints} quizzesTaken={streakData.quizzesTaken} />
            <EnhancedStreakDashboard />
          </View>
        );
      
      case 'rankings':
        return (
          <View style={styles.rankingsContainer}>
            <View style={styles.userRankCard}>
              <Text style={styles.sectionTitle}>Your Global Ranking</Text>
              <View style={styles.rankBadge}>
                <Text style={styles.rankNumber}>#{userProfile.rank}</Text>
              </View>
              <Text style={styles.rankScore}>{userProfile.score} points</Text>
              <Text style={styles.rankLevel}>{userProfile.level}</Text>
            </View>
            
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            {GLOBAL_RANKINGS.map((player, index) => (
              <View key={player.id} style={styles.leaderboardItem}>
                <Text style={styles.rankPosition}>#{index + 1}</Text>
                <Image source={{ uri: player.avatar }} style={styles.rankAvatar} />
                <View style={styles.rankInfo}>
                  <Text style={styles.rankName}>{player.name}</Text>
                  <Text style={styles.rankPlayerScore}>{player.score} points</Text>
                </View>
                {index === 0 && (
                  <MaterialIcons name="emoji-events" size={24} color="#FFD700" />
                )}
              </View>
            ))}
            
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View Full Leaderboard</Text>
              <Feather name="chevron-right" size={18} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: "https://i.pinimg.com/736x/56/41/71/5641710b1ad9a0dce17b58e2424c3cd2.jpg" }}
          style={styles.headerBackground}
        >
          <View style={styles.headerOverlay}>
            <ProfileHeader
              photo={userProfile.photo}
              name={userProfile.name}
              email={userProfile.email}
              onEditPress={handleEditProfile}
            />
          </View>
        </ImageBackground>
        
        <View style={styles.content}>
          {/* Bio and designation */}
          <View style={styles.bioSection}>
            <Text style={styles.username}>{userProfile.username}</Text>
            <Text style={styles.designation}>{userProfile.designation}</Text>
            <Text style={styles.bio}>{userProfile.bio}</Text>
            
            {/* Social links */}
            <View style={styles.socialLinks}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openSocialLink('instagram', userProfile.socialLinks.instagram)}
              >
                <FontAwesome name="instagram" size={20} color="#E1306C" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openSocialLink('linkedin', userProfile.socialLinks.linkedin)}
              >
                <FontAwesome name="linkedin-square" size={20} color="#0077B5" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openSocialLink('youtube', userProfile.socialLinks.youtube)}
              >
                <FontAwesome name="youtube-play" size={20} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
              onPress={() => setActiveTab('achievements')}
            >
              <Ionicons 
                name="trophy" 
                size={20} 
                color={activeTab === 'achievements' ? '#4CAF50' : '#666'} 
              />
              <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
                Achievements
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'rankings' && styles.activeTab]}
              onPress={() => setActiveTab('rankings')}
            >
              <Ionicons 
                name="podium" 
                size={20} 
                color={activeTab === 'rankings' ? '#4CAF50' : '#666'} 
              />
              <Text style={[styles.tabText, activeTab === 'rankings' && styles.activeTabText]}>
                Rankings
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Tab content */}
          {renderTabContent()}
          
          {/* Logout button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  headerBackground: {
    height: 320,
    width: '100%',
  },
  headerOverlay: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(76, 175, 80, 0.85)',
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
    paddingBottom: 40,
  },
  bioSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  designation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 15,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  achievementsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  achievementsScroll: {
    marginBottom: 20,
  },
  rankingsContainer: {
    padding: 15,
  },
  userRankCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  rankNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  rankScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  rankLevel: {
    fontSize: 16,
    color: '#666',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rankPosition: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rankAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rankPlayerScore: {
    fontSize: 14,
    color: '#666',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4CAF50',
    marginRight: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF5252',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 50,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileScreen;