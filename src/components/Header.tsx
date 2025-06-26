import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';

// common header component for all other tab screens.
const Header = ({
  handleAddTask,
  title,
}: {
  title: string;
  handleAddTask?: () => void;
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {handleAddTask && (
        <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 24,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
});
export default Header;
