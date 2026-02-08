import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";

const Saved = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  const fetchUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <View style={{ padding: 16 }}>
          {/* LOGIN FORM */}
          <Text>Email</Text>
          <TextInput
            keyboardType="email-address"
            placeholder="email"
            value={email}
            onChangeText={setEmail}
          />

          <Text>Password</Text>
          <TextInput
            secureTextEntry
            placeholder="password"
            value={password}
            onChangeText={setPassword}
          />

          <Pressable onPress={handleSubmit}>
            <Text>Login</Text>
          </Pressable>

          {loading && <ActivityIndicator size="large" />}
          {error && <Text>Error: {error.message}</Text>}
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ padding: 12 }}>
          <Text>{item.name}</Text>
          <Text>{item.username}</Text>
          <Text>{item.email}</Text>
        </View>
      )}
      ListEmptyComponent={!loading && <Text>No users found</Text>}
    />
    
  );
};

export default Saved;
