'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { Box, Modal, Stack, TextField, Typography, Button } from "@mui/material";
import axios from 'axios';
import AppBarHeader from '../components/AppbarHeader';
import Pagination from '../components/pagination';
import Auth from '@/components/auth';

const API_BASE = 'http://localhost:5281/api/Pantry'; 
export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemname, setItemname] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const router = useRouter(); 
  const [role, setRole] = useState('');



  const fetchData = async (page) => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  
    try {
      const { data: result } = await axios.get(`${API_BASE}/paged`, {
        params: { page, pageSize }
      });
      console.log('paged result', result);
      setData(result.items);
      setTotalItems(result.totalItems);
    } catch (err) {
      console.error('Error fetching pantry:', err.response ?? err);
    }
  };
  
 
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
      setLoggedInUsername(storedUsername);
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData(currentPage);  
    }
  }, [isLoggedIn, currentPage]);
  
    
    
  const addItem = async (item) => {
    await axios.post(`${API_BASE}/${item}`);
    await fetchData(currentPage); 
    
  };
  
  const removeItem = async (item) => {
    await axios.delete(`${API_BASE}/${item}`);
    await fetchData(currentPage); 
   
  };



const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role')
  delete axios.defaults.headers.common['Authorization'];
  setIsLoggedIn(false);
  setLoggedInUsername('');
  setData([]);
  setFilteredPantry([]);
};
  useEffect(() => {
    setFilteredPantry(
      data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    console.log(filteredPantry);
  }, [searchTerm, data]);

  const handleOpen = () => {
    if (!isLoggedIn) {
      alert('Please login or register first to add items.');
      setAuthModalOpen(true);
    } else {
      setOpen(true);
    }
  };
  
 
  const handleClose = () => setOpen(false);

  return (
<Box 
  width="100vw" 
  minHeight="100vh" 
  display="flex" 
  flexDirection="column" 
  alignItems="center" 
  gap={2} 
  sx={{ 
    backgroundColor: '#d3d6cf', 
    padding: 2, 
    overflowX: 'hidden',
    overflowY: 'auto'
  }}
>

    <AppBarHeader
      isLoggedIn={isLoggedIn}
      role={role}
      logout={logout}
      setAuthModalOpen={setAuthModalOpen}
      />
      <Auth 
      open={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      onLoginSuccess={({ username , role}) =>{
        setIsLoggedIn(true);
        setLoggedInUsername(username);
        setRole(role);
      }}/>

      <Box
        marginTop="64px" 
        width="100vw"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <TextField
            variant="outlined"
            placeholder="Search items..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ backgroundColor: '#bea175', borderRadius: 25 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            sx={{ borderRadius: 25, bgcolor: '#bb7266', '&:hover': { bgcolor: '#815236' } }}
          >
            Add New Item
          </Button>
        </Stack>

        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="#bea175"
            border="2px solid #591814"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ transform: "translate(-50%, -50%)", borderRadius: 8 }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant='outlined'
                fullWidth
                value={itemname}
                onChange={(e) => setItemname(e.target.value)}
                sx={{ borderRadius: 25 }}
              />
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  addItem(itemname);
                  setItemname('');
                  handleClose();
                }}
                sx={{ borderRadius: 25, bgcolor: '#bb7266', '&:hover': { bgcolor: '#815236' } }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Box
          width="800px"
          bgcolor="#fff"
          borderRadius="12px"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.15)"
          p={2}
          border="1px solid #ddd"
        >
          <Box
            height="100px"
            bgcolor="#591814"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="12px 12px 0 0"
            mb={2}
          >
            <Typography variant='h4' color='#fff'>
              Pantry Tracker
            </Typography>
          </Box>
           <Stack width="100%" spacing={2} overflow="auto">
            {filteredPantry.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="60px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f9f9f9"
                padding={2}
                borderRadius="8px"
                border="1px solid #ddd"
                boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
              >
                <Typography variant='h6' color="#333">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant='h6' color="#333">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => addItem(name)}
                    sx={{ borderRadius: 25, bgcolor: '#bb7266', '&:hover': { bgcolor: '#815236' } }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeItem(name)}
                    sx={{ borderRadius: 25, borderColor: '#591814', color: '#591814', '&:hover': { borderColor: '#bb7266', color: '#bb7266' } }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
          <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          setCurrentPage={(page) => setCurrentPage(page)} />
        </Box>
      </Box>
    </Box>
  );
}