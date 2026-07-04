import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HomeStackNavigator from './HomeStackNavigator';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors } from '../theme/colors';
import { HouseIcon, OrdersIcon, PersonIcon } from '../components/Icons';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_CONFIG: Record<keyof MainTabParamList, { label: string; Icon: typeof HouseIcon }> = {
  HomeTab: { label: 'Home', Icon: HouseIcon },
  OrdersTab: { label: 'Orders', Icon: OrdersIcon },
  ProfileTab: { label: 'Profile', Icon: PersonIcon },
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { label, Icon } = TAB_CONFIG[route.name as keyof MainTabParamList];
        const color = focused ? Colors.primary : Colors.muted;

        const onPress = () => {
          if (!focused) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={onPress}
          >
            <View style={[styles.indicator, focused && styles.indicatorActive]} />
            <Icon size={24} color={color} />
            <Text style={[styles.tabLabel, { color }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen name="OrdersTab" component={OrdersScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E0D8',
    paddingTop: 6,
    paddingBottom: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  indicator: {
    width: '55%',
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  indicatorActive: {
    backgroundColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
