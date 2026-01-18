
export const MainPage = () => {
    // const dispatch = useAppDispatch();
    // const movies = useAppSelector((state) => state.movieStoreSlice.movies);
    //
    //    useEffect(() => {
    //     dispatch(movieActions.loadMovies('1'));
    // }, [dispatch]);


    return (
        <main className="p-6">
            <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                Welcome to The Movies App
            </h1>

            <section className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-gray-700"> Popular Movies</h2>
                {/*<div className="grid grid-cols-2 md:grid-cols-4 gap-4">*/}
                {/*    {movies.slice(0, 8).map((movie) => (*/}
                {/*        <MovieDetailCard key={movie.id} movie={movie} />*/}
                {/*    ))}*/}
                {/*</div>*/}
            </section>


        </main>
    );
};



























