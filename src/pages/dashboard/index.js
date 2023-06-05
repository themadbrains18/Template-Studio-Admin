import Layout from "../layout";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import EditIcon from '@mui/icons-material/Edit';


export default function Index() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    getAllProduct();
  }, []);

  const getAllProduct = async () => {
    try {
      const localToken = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_APIURL}admin/dashboard/all`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'token': localToken
        }
      })
        .then(response => response.json())
        .then(async result => {
          if (result.status === 200) {
            setAllProducts(result.data)
          }
        })
        .catch(err => {
          console.log(err)
          
        })
    } catch (error) {

    }
  }

  function createData(
    name,
    version,
    price
  ) {
    return { name, version,price  };
  }

  return (
    <>
      <Box style={{ width: '100%', textAlign: 'right', marginRight :'20px' }}><Button variant="contained" size="large" sx={{ mt: 3 }} onClick={()=>{router.push("/dashboard/upload-product");}}>Add New Template</Button></Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Template Name</TableCell>
              <TableCell>Template Type</TableCell>
              <TableCell align="right">Version</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allProducts.map((row) => (
              <TableRow
                key={row?.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row?.name}
                </TableCell>
                <TableCell>{row?.templatecategories[0].category?.category}</TableCell>
                <TableCell align="right">{row?.version}</TableCell>
                <TableCell align="right">{row?.price !=null ? `$${row?.price}`:'Free'}</TableCell>
                <TableCell align="right"><EditIcon className="editIcon" onClick={()=>{router.push(`/dashboard/edit-product/${row?.id}`)}}/></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}



Index.getLayout = function getLayout(page) {
  return (<Layout variant="Dashboard">{page}</Layout>)
};