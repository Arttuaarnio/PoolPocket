import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getPoolAdvice, Message } from "./PoolHelperAI";

// show the messages
type ChatMessageProps = {
  message: string;
  isUser: boolean;
};

const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text style={styles.messageSender}>
        {isUser ? "You" : "PoolAI"}
      </Text>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

// chat message structure
type ChatMessageType = {
  text: string;
  isUser: boolean;
};

const Chatbot = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const suggestions = [
    "How do I improve my break shot?",
    "What are the rules of 8-ball pool?",
    "Recommend me a beginner friedly cue",
    "What's the difference between Snooker and Pool?",
  ];

  // Handle user messages
  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, isUser: true },
    ]);

    setIsLoading(true);

    try {
      // Format conversation history
      const conversationHistory: Message[] = messages.map((msg) => ({
        role: msg.isUser ? "user" : ("assistant" as "user" | "assistant"),
        content: msg.text,
      }));

      // OpenAI response
      const response = await getPoolAdvice(userMessage, conversationHistory);

      // ai response
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response, isUser: false },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, I couldn't process your request. Please try again later.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  // Scroll to bottom when theres new messages
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pool & Billiards Assistant</Text>
      </View>

      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome!</Text>
            <Text style={styles.welcomeText}>
              Ask me anything about billiards.
            </Text>

            <Text style={styles.suggestionsTitle}>Try asking:</Text>
            <View style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionButton}
                  onPress={() => handleSuggestion(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Chat messages */}
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isUser={message.isUser}
          />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#006F44" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask anything about billiards..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={input.trim() === "" || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginTop: 60,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  welcomeContainer: {
    padding: 20,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  welcomeText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#333",
    alignSelf: "flex-start",
  },
  suggestionsContainer: {
    width: "100%",
  },
  suggestionButton: {
    backgroundColor: "#E0F5E0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#C0E0C0",
  },
  suggestionText: {
    color: "#006F44",
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#E0F5E0",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  messageSender: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 12,
    color: "#555",
  },
  messageText: {
    fontSize: 15,
    color: "#333",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#006F44",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Chatbot;
