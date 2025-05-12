import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking
} from 'react-native';
import Constants from 'expo-constants';

const CONTACT_EMAIL = Constants.expoConfig?.extra?.CONTACT_EMAIL;

interface ContactUsModalProps {
  visible: boolean;
  onClose: () => void;
}

const ContactUsModal: React.FC<ContactUsModalProps> = ({ visible, onClose }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Please enter a message.');
      return;
    }
    setSending(true);
    const email = CONTACT_EMAIL;
    const subject = encodeURIComponent('App Support');
    const body = encodeURIComponent(message);
    const link = `mailto:${email}?subject=${subject}&body=${body}`;
    try {
      await Linking.openURL(link);
      setMessage('');
      onClose();
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Unable to open email client');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Contact Us</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Your Message</Text>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={6}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message here..."
            placeholderTextColor="#888"
            editable={!sending}
          />
          <TouchableOpacity
            style={[styles.submitButton, sending && { backgroundColor: '#888' }]}
            onPress={handleSubmit}
            disabled={sending}
          >
            <Text style={styles.submitButtonText}>{sending ? 'Sending...' : 'Submit'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    color: 'white',
    fontSize: 24,
    padding: 5,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  textarea: {
    backgroundColor: '#222',
    color: 'white',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactUsModal;
