import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Send, Upload, MessageSquare } from 'lucide-react-native';
import { useChat } from '../context/ChatContext';

// NOTE: In NativeWind v4, we don't need 'styled()'. 
// We just use className directly on View/Text.

export default function HomeScreen() {
    const { messages, sendMessage, isTyping, handleUpload, isUploading, resumeName } = useChat();
    const [input, setInput] = useState('');
    const flatListRef = useRef();

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                handleUpload(result.assets[0]);
            }
        } catch (err) {
            console.log('Unknown Error: ', err);
        }
    };

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages, isTyping]);

    const renderMessage = ({ item }) => (
        <View className={`flex-row mb-4 ${item.isBot ? 'justify-start' : 'justify-end'}`}>
            <View className={`p-4 max-w-[85%] rounded-2xl ${item.isBot
                ? 'bg-white border border-gray-200 rounded-tl-none'
                : 'bg-gray-800 rounded-tr-none'
                }`}>
                <Text className={`text-base ${item.isBot ? 'text-gray-800' : 'text-white'}`}>
                    {item.text}
                </Text>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-100">
            {/* Header */}
            <View className="pt-12 pb-4 px-4 bg-white border-b border-gray-200 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center border border-gray-200">
                        <MessageSquare color="#333" size={20} />
                    </View>
                    <View>
                        <Text className="font-bold text-lg text-gray-800">Resume Chat</Text>
                        <Text className="text-xs text-gray-500">Active: {resumeName}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={pickDocument} disabled={isUploading} className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                    {isUploading ? <ActivityIndicator size="small" color="#000" /> : <Upload size={20} color="#333" />}
                </TouchableOpacity>
            </View>

            {/* Chat Area */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
                className="flex-1"
                ListFooterComponent={isTyping && (
                    <View className="p-4 items-start">
                        <Text className="text-gray-400 text-sm">Thinking...</Text>
                    </View>
                )}
            />

            {/* Input Area */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={10}>
                <View className="p-4 bg-white border-t border-gray-200 flex-row items-center gap-2">
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        placeholder="Ask about the resume..."
                        className="flex-1 bg-gray-100 p-3 rounded-xl text-gray-800 h-12"
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={!input.trim()}
                        className={`w-12 h-12 items-center justify-center rounded-xl ${input.trim() ? 'bg-gray-900' : 'bg-gray-300'}`}
                    >
                        <Send size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}