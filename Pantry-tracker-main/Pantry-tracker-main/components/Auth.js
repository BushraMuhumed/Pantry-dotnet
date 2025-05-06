'use client';
import { useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Auth({ open, onClose, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    if (loading) return;
    setLoading(true);
    const endpoint = isRegistering ? 'register' : 'login';
  
    try {
      const payload = isRegistering
        ? { email, password, username }
        : { email, password };
  
      const res = await axios.post(`http://localhost:5281/api/Auth/${endpoint}`, payload);
      const { token, username: returnedUsername, role } = res.data;
  
      localStorage.setItem('token', token);
      localStorage.setItem('username', returnedUsername);
      localStorage.setItem('role', role);

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
  
      
      
      onLoginSuccess({ username: returnedUsername, role });

        
      onClose();
      setEmail('');
      setPassword('');
      setUsername('');
  
      if (role === 'Admin') {
        router.push('/admin');
      }
  
    } catch (err) {
      const errorData = err.response?.data;
      const errormess = errorData?.errors
        ? Object.values(errorData.errors).flat().join(', ')
        : 'An error occurred during authentication.';
      alert(errormess);
    } finally {
      setLoading(false);
    }
  };
  

   return (
    <Modal open={open} onClose={onClose}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width={400}
        bgcolor="#fff"
        border="2px solid #591814"
        boxShadow={24}
        p={4}
        sx={{ transform: "translate(-50%, -50%)", borderRadius: 8 }}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Typography variant="h6" color="#591814">{isRegistering ? 'Register' : 'Login'}</Typography>
        {isRegistering && (
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
        )}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleAuth}
          sx={{ bgcolor: '#bb7266', '&:hover': { bgcolor: '#815236' } }}
          disabled={loading}
        >
          {isRegistering ? 'Register' : 'Login'}
        </Button>
        <Button variant="text" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Have an account? Login' : "Don't have an account? Register"}
        </Button>
      </Box>
    </Modal>
  );
}
