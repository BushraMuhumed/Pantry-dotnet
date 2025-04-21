'use client';
import { useState, useEffect } from "react";
import { AppBar, Box, Modal, Stack, TextField, Toolbar, Typography, Button } from "@mui/material";
import axios from 'axios';

const API_BASE = 'http://localhost:5281/api/Pantry'; 
export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemname, setItemname] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5;



  const fetchData = async (page) => {

    const res = await fetch(`http://localhost:5281/api/Pantry/paged?page=${page}&pageSize=${pageSize}`);
    const result = await res.json();

    setData(result.items);
    setTotalItems(result.totalItems);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      
    }
  };


  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  
  const addItem = async (item) => {
    await axios.post(`${API_BASE}/${item}`);
    await fetchData(currentPage); 
    
  };
  
  const removeItem = async (item) => {
    await axios.delete(`${API_BASE}/${item}`);
    await fetchData(currentPage); 
   
  };

  


  useEffect(() => {
    setFilteredPantry(
      data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data]);
  


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      sx={{ backgroundColor: '#d3d6cf', padding: 2 }}
    >
      <AppBar position="fixed" color="primary" sx={{ top: 0, left: 0, right: 0, bgcolor: '#591814' }}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1 }}
            style={{ fontFamily: 'Butler, Playfair Display, serif' }}
          >
            Pantry Tracker
          </Typography>
        </Toolbar>
      </AppBar>

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


      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

      

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>


        </Box>
      </Box>
    </Box>
  );
}