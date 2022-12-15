import { useQuery } from "@apollo/client";
import { Search } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import React, { useRef, useState } from "react";
import PokemonStatusGraph from "./PokemonStatusGraph";
import { gqlPokemonToPokemon, QUERY_GET_POKEMON_BY_ID } from "./query";

const App: React.FC = () => {
  const [pokemonName, setPokemonName] = useState("ピカチュウ");
  const inputRef = useRef<HTMLInputElement>(null);

  const { loading, error, data } = useQuery(QUERY_GET_POKEMON_BY_ID, {
    variables: { name: pokemonName },
  });

  const searchPokemon = (e: any) => {
    if (e)e.preventDefault();
    const newPokemonName = inputRef.current?.value;
    if (newPokemonName) {
      setPokemonName(newPokemonName);
    }
  };

  const pokemon = data ? gqlPokemonToPokemon(data) : null;

  return (
    <Grid container spacing={2} sx={{ padding: "25px 15%" }}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={searchPokemon} sx={{ mr: 1, my: 0.5 }}>
              <Search />
            </IconButton>
          <form onSubmit={searchPokemon}>
            <TextField inputRef={inputRef} variant="standard" />
          </form>
          </Box>
        </Box>
      </Grid>
      {loading ? (
        <CircularProgress size={150} />
      ) : error ? (
        <Paper>Error : {error.message}</Paper>
      ) : !pokemon ? (
        <p>Error : Result not found.</p>
      ) : (
        <>
          <Grid item xs={6}>
            <PokemonStatusGraph status={pokemon.status} />
          </Grid>
          <Grid item xs={6}>
            <img src={pokemon.imageUrl} height="200px" alt="pokemon" />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>{pokemon.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>名前</TableCell>
                    <TableCell>{pokemon.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>タイプ</TableCell>
                    <TableCell>
                      {pokemon.type1}
                      {pokemon.type2 ? "・" + pokemon.type2 : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>説明</TableCell>
                    <TableCell>{pokemon.description}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default App;
