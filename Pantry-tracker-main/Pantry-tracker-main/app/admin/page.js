'use client';
import { useState, useEffect } from "react";
import { AppBar, Box, Stack, TextField, Toolbar, Typography, Button, ButtonGroup } from "@mui/material";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_BASE = 'http://localhost:5281/api'; 

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/Admin/users`);
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err.response ?? err);
    }
  };
  
  const fetchUserPantry = async (UserId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_BASE}/Admin/pantry/${UserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      
      const user = users.find(u => u.id === UserId);
  
      setSelectedUser({
        username: user?.username || 'Unknown User',
        pantryItems: data,
      });
  
    } catch (err) {
      console.error('Error fetching pantry:', err.response ?? err);
      alert('No pantry items found for this user');
    }
  };
  


  
  
  
  const promoteToAdmin = async (id) => {
    try {
      await axios.put(`${API_BASE}/Admin/promote/${id}`);
      alert('User promoted to Admin');
      fetchUsers();
    } catch (err) {
      console.error('Error promoting user:', err.response ?? err);
      alert('Failed to promote user');
    }
  };

  
  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_BASE}/Admin/delete-user/${id}`);
        alert('User deleted');
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err.response ?? err);
        alert('Failed to delete user');
      }
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      sx={{ backgroundColor: '#f0f0f0', padding: 2 }}
    >
      <AppBar position="fixed" color="primary" sx={{ top: 0, left: 0, right: 0, bgcolor: '#591814' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }} style={{ fontFamily: 'Butler, Playfair Display, serif' }}>
            Admin Dashboard
          </Typography>
          <Button
      color="inherit"
      onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        delete axios.defaults.headers.common['Authorization'];
        router.push('/'); 
      }}
    >
      Logout
    </Button>
        </Toolbar>
      </AppBar>

      <Box marginTop="64px" width="100%" display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h4" color="#591814">Registered Users</Typography>

       

        <Box width="80%" bgcolor="#fff" borderRadius="12px" boxShadow="0px 4px 12px rgba(0, 0, 0, 0.15)" p={2} mt={2}>
          <Stack spacing={2}>
            {users.map((user) => (
              <Box
                key={user.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#f9f9f9"
                p={2}
                borderRadius="8px"
                border="1px solid #ddd"
              >
                <Typography variant="h6">{user.username}</Typography>
                <Box>
                <ButtonGroup >
                <Button
                    variant="contained"
                    onClick={() => fetchUserPantry(user.id)}
                    sx={{
                    borderRadius: '20px',
                    bgcolor: '#815236',
                    color: '#ffffff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    '&:hover': { bgcolor: '#6a3f2c' },
                    textTransform: 'none',
                    px: 3,
                    }}
                >
                    View Pantry
                </Button>
                <Button
                    variant="contained"
                    onClick={() => promoteToAdmin(user.id)}
                    sx={{
                    borderRadius: '20px',
                    bgcolor: '#bb7266',
                    color: '#ffffff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    '&:hover': { bgcolor: '#a15c51' },
                    textTransform: 'none',
                    px: 3,
                    }}
                >
                    Promote to Admin
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteUser(user.id)}
                    sx={{
                    borderRadius: '20px',
                    bgcolor: '#c62828',
                    color: '#ffffff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    '&:hover': { bgcolor: '#a12020' },
                    textTransform: 'none',
                    px: 3,
                    }}
                >
                    Delete User
                </Button>
                </ButtonGroup>

                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        {selectedUser && selectedUser.pantryItems && (
          <Box width="80%" bgcolor="#fff" borderRadius="12px" boxShadow="0px 4px 12px rgba(0, 0, 0, 0.15)" p={2} mt={2}>
            <Typography variant="h6" color="#591814">Pantry Items for {selectedUser.username}</Typography>
            <Stack spacing={2}>
              {selectedUser.pantryItems.map((item) => (
                <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center" bgcolor="#f9f9f9" p={2} borderRadius="8px" border="1px solid #ddd">
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body1">{item.quantity}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
