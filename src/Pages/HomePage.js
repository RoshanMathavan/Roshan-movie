import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import MovieDetails from './MovieDetails';
import Result from './Result';
import Search from './Search';

function HomePage() {
    const [state, setState] = useState({
        search: "",
        results: [],
        selected: {}
    });

    useEffect(() => {
        axios.get(`https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&type=movie&s=spider`)
            .then(res => {
                setState(prevState => {
                    return { ...prevState, results: res.data.Search }
                });
            })
            .catch(err => console.log(err));
    }, []);
    
    const openDetails = (id) => {
        axios.get(`https://www.omdbapi.com/?i=${id}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`)
            .then(({ data }) => {
                setState((prevState) => {
                    return { ...prevState, selected: data }
                });
            })
            .catch(err => console.log(err));
    }
    
    const SearchResult = (event) => {
        if (event.key === 'Enter') {
            axios.get(`https://www.omdbapi.com/?i=tt3896198&apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${state.search}`)
                .then(res => {
                    setState(prevState => {
                        return { ...prevState, results: res.data.Search }
                    });
                })
                .catch(err => console.log(err));
        }
    }
        const close = () => {
        setState((prevState) => {
            return { ...prevState, selected: {} }
        });
    }

    return (
        <div className="w-100 main-wrapper d-flex flex-column align-items-center min-vh-100">
            {typeof state.selected.Title !== "undefined" ? (
                <MovieDetails selected={state.selected} close={close} />
            ) : (
                <header className="w-100 text-center text-white mt-5">
                    <h2>Movie Search</h2>
                    <Search handleInput={handleInput} SearchResult={SearchResult} />
                    <div className="container">
                        <div className="row">
                            {state.results && state.results.map((result, i) => (
                                <div className="col-12 col-sm-6 col-md-3 col-lg-3 my-2" key={i}>
                                    <Result result={result} openDetails={openDetails} />
                                </div>
                            ))}
                        </div>
                    </div>
                </header>
            )}
        </div>
    );
}

export default HomePage;
