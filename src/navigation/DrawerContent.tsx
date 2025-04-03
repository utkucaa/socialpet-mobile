import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import { Theme } from '@/theme/types';

const DrawerContent = (props: any) => {
  const { theme } = useTheme();
  const menuItems = [
    { icon: 'user', label: 'Profilim', route: 'Profile' },
    { icon: 'message-circle', label: 'Mesaj', route: 'Messages' },
    { icon: 'bell', label: 'Hatırlatıcılar', route: 'Reminders' },
    { icon: 'volume-2', label: 'Duyurular', route: 'Announcements' },
    { icon: 'settings', label: 'Ayarlar', route: 'Settings' },
  ];

  const footerItems = [
    { label: 'Şartlar & Koşullar', route: 'Terms' },
    { label: 'Gizlilik Politikası', route: 'Privacy' },
    { label: 'SSS ve Destek', route: 'Support' },
  ];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
      >
        <View style={styles.userSection}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/300' }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>Utku Çolak</Text>
          <Text style={styles.userLocation}>Konya, Turkey</Text>
        </View>

        <ScrollView style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => props.navigation.navigate(item.route)}
            >
              <Icon name={item.icon} size={22} color={theme.colors.text.primary} style={styles.menuIcon} />
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          {footerItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => props.navigation.navigate(item.route)}
            >
              <Text style={styles.footerText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.logoutButton}>
            <Icon name="log-out" size={20} color="#FF3B30" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = useStyles((theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  drawerContent: {
    flex: 1,
    paddingTop: theme.spacing.l,
  },
  userSection: {
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: theme.spacing.s,
  },
  userName: {
    fontSize: theme.typography.fontSize.l,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  userLocation: {
    fontSize: theme.typography.fontSize.m,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  menuItems: {
    flex: 1,
    paddingTop: theme.spacing.l,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  menuIcon: {
    marginRight: theme.spacing.s,
  },
  menuText: {
    fontSize: theme.typography.fontSize.m,
    color: theme.colors.text.primary,
  },
  footer: {
    padding: theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  footerText: {
    fontSize: theme.typography.fontSize.s,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.s,
  },
  logoutButton: {
    marginTop: theme.spacing.l,
    paddingVertical: theme.spacing.s,
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.s,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutText: {
    color: theme.colors.error.main,
    fontSize: theme.typography.fontSize.m,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
}));

export default DrawerContent;
