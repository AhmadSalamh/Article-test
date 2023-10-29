import { useEffect, useState } from "react";
import axios from "axios";
import Card from '../../components/Card/Card'
import Loader from '../../components/Loader/Loader'
import "./search.scss";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [searchDate, setSearchDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchPerformed, setIsSearchPerformed] = useState(false);
    const [isNotEmpty, setIsNotEmpty] = useState(true);
    const [selectedSource, setSelectedSource] = useState("");
    const [oldFilteredArticles, setOldFilteredArticles] = useState([]);

    const fetchArticles = async () => {
        try {
            setIsLoading(true);

            const newsApiUrl = `${import.meta.env.VITE_NEWS_API_URL}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`;
            const guardianApiUrl = `${import.meta.env.VITE_GUARDIAN_API_URL}/search?q=&api-key=${import.meta.env.VITE_GUARDIAN_API_KEY}`;
            const nytApiUrl = `${import.meta.env.VITE_NYT_API_URL}?q=&api-key=${import.meta.env.VITE_NYT_API_KEY}`;

            const [guardianApiResponse, nytApiResponse, newsApiResponse] =
                await Promise.all([
                    axios.get(guardianApiUrl),
                    axios.get(nytApiUrl),
                    axios.get(newsApiUrl),
                ]);

            // const newsArticles = newsApiResponse.data.articles;
            const guardianArticles = guardianApiResponse.data.response.results;
            const nytArticles = nytApiResponse.data.response.docs;
            const newsArticles = newsApiResponse.data.articles;


            const combinedArticles = [
                ...newsArticles,
                ...guardianArticles,
                ...nytArticles,
            ];

            console.log(combinedArticles);

            setArticles(combinedArticles);
            setFilteredArticles(combinedArticles);

            setIsLoading(false);
        } catch (error) {
            setIsLoading(true);
            console.error(error);
        }
    };

    const addQuerySearch = (e) => {
        setSearchQuery(e.target.value);
        e.target.value === "" ? setIsNotEmpty(true) : setIsNotEmpty(false)
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const filtered = articles.filter(
            (article) =>
                article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.webTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.headline?.main
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );
        setFilteredArticles(filtered);
        setOldFilteredArticles(filtered)
        setIsLoading(false);
        setIsSearchPerformed(true);
    };

    const handleFilter = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const filteredByDate = oldFilteredArticles.filter((article) => {
            const articleDate = new Date(
                article.publishedAt || article.webPublicationDate || article.pub_date
            );
            const selectedDate = new Date(searchDate);

            return articleDate.toDateString() === selectedDate.toDateString();
        });

        setFilteredArticles(filteredByDate);
        setIsLoading(false);
    };

    const handleSourceChange = (e) => {
        const selectedSource = e.target.value;
        setSelectedSource(selectedSource);

        if (selectedSource === "nytimes") {
            handleFilterByNYTimes();

        } else if (selectedSource === "guardian") {
            handleFilterByGuardian();
        } else {
            handleFilterByNews()
        }
    };

    const handleFilterByNYTimes = () => {
        setIsLoading(true);

        const filteredByNYTimes = oldFilteredArticles.filter((article) => {
            return article.source === "The New York Times";
        });

        setFilteredArticles(filteredByNYTimes);
        setIsLoading(false);
    };

    const handleFilterByGuardian = () => {
        setIsLoading(true);

        const filteredByGuardian = oldFilteredArticles.filter((article) => {
            return article.apiUrl && article.apiUrl.includes("guardianapis.com");
        });

        setFilteredArticles(filteredByGuardian);
        setIsLoading(false);
    };

    const handleFilterByNews = () => {
        setIsLoading(true);

        const filteredByNews = oldFilteredArticles.filter((article) => {
            return Object.prototype.hasOwnProperty.call(article, 'author');
        });

        setFilteredArticles(filteredByNews);
        setIsLoading(false);
    };

    const handleFilterByCategory = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const selectedCategory = e.target.value;

        const filteredByCategory = oldFilteredArticles.filter((article) => {
            return (
                article.pillarName === selectedCategory ||
                article.subsection_name === selectedCategory
            );
        });

        setFilteredArticles(filteredByCategory);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);
    return (
        <section>
            <div className="container">
                <form className="search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={addQuerySearch}
                        placeholder="Search within results"
                    />
                    <button className="btn" disabled={isNotEmpty}>Search</button>
                </form>

                <h2 className="main-title">Filter By</h2>
                <div className="fitter-by">
                    <form onSubmit={handleFilter} >
                        <input type="date" disabled={!isSearchPerformed} value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                        <button className="btn" disabled={!isSearchPerformed}>Filter</button>
                    </form>

                    <select value={selectedSource} onChange={handleSourceChange} disabled={!isSearchPerformed}>
                        <option value="">Select a source</option>
                        <option value="nytimes">The New York Times</option>
                        <option value="guardian">The Guardian</option>
                        <option value="news">news</option>
                    </select>

                    <select onChange={handleFilterByCategory} disabled={!isSearchPerformed}>
                        <option value="">Select a category</option>
                        <option value="Sport">Sport</option>
                        <option value="Opinion">Opinion</option>
                        <option value="News">News</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Arts">Arts</option>
                        <option value="Music">Music</option>
                    </select>
                </div>
            </div>
            <div className="container">
                <div className="articles">
                    {isLoading ? (
                        <Loader />
                    ) : filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                            <Card article={article} key={article.id || article._id} />
                        ))
                    ) : (
                        <p className="no-data">There is no results</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Search;
