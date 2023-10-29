import { useEffect, useState } from "react";
import axios from "axios";
import './CustomizeArticles.scss'
import Loader from "../../components/Loader/Loader";
import Card from "../../components/Card/Card";

const CustomizeArticles = () => {
    const [combinedCategory, setCombinedCategory] = useState([])
    const [combinedAuthor, setCombinedAuthor] = useState([])
    const [selectedSource, setSelectedSource] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedAuthor, setSelectedAuthor] = useState("");
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedArticles, setGeneratedArticles] = useState([]);


    const fetchArticles = async () => {
        try {
            const newsUrlAuthors = `${import.meta.env.VITE_NEWS_API_URL}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`;
            const guardianUrlCat = `${import.meta.env.VITE_GUARDIAN_API_URL}/sections?api-key=${import.meta.env.VITE_GUARDIAN_API_KEY}`;
            const guardianUrlAuthors = `${import.meta.env.VITE_GUARDIAN_API_URL}/search?api-key=${import.meta.env.VITE_GUARDIAN_API_KEY}&show-fields=byline`;
            const nytApiUrlCat = `${import.meta.env.VITE_NYT_API_URL}?q=&api-key=${import.meta.env.VITE_NYT_API_KEY}`;

            const guardianCategories = [];
            const nytCategories = [];

            const guardianAuthors = [];
            const newsAuthors = [];
            const nytAuthors = [];

            const [guardianRes, nytRes, guardianAuthorsRes, newsRes] = await Promise.all([
                axios.get(guardianUrlCat),
                axios.get(nytApiUrlCat),
                axios.get(guardianUrlAuthors),
                axios.get(newsUrlAuthors),

            ]);

            const guardianArticles = guardianRes.data.response.results;
            const nytArticles = nytRes.data.response.docs;
            const newsArticles = newsRes.data.articles;
            const guardianAuthorsArt = guardianAuthorsRes.data.response.results;


            const combinedArticles = [
                ...newsArticles,
                ...guardianArticles,
                ...nytArticles,
                ...guardianAuthorsArt
            ];
            setArticles(combinedArticles)

            newsRes.data.articles.forEach((category) => {
                newsAuthors.push(category.author);
            });

            guardianRes.data.response.results.forEach((category) => {
                guardianCategories.push(category.webTitle);
            });

            guardianAuthorsRes.data.response.results.forEach((category) => {
                guardianAuthors.push(category.fields.byline);
            });

            nytRes.data.response.docs.forEach((category) => {
                const persons = category.byline.person;
                persons.forEach((person) => {
                    const { firstname, lastname } = person;

                    const fullName = `${firstname} ${lastname}`;
                    nytAuthors.push(fullName);
                });

                nytCategories.push(category.section_name);
            });

            const combinedNewCategory = [...guardianCategories, ...nytCategories];
            const combinedNewAuthor = [...guardianAuthors, ...nytAuthors, ...newsAuthors];

            const uniqueCategories = Array.from(new Set(combinedNewCategory));
            const uniqueAuthors = Array.from(new Set(combinedNewAuthor));

            setCombinedCategory(uniqueCategories)
            setCombinedAuthor(uniqueAuthors)

        } catch (error) {
            console.error(error);
        }
    };
    const generateArticles = (e) => {
        e.preventDefault();

        let filteredArticles = [...articles];

        if (selectedSource) {
            filteredArticles = filteredArticles.filter((article) => {
                if (selectedSource === 'The New York Times') {
                    return article.source === 'The New York Times';
                } else if (selectedSource === 'The Guardian') {
                    return (
                        article.apiUrl &&
                        article.apiUrl.includes('guardianapis.com')
                    );
                } else if (selectedSource === 'News') {
                    return article.author && article.author.length > 0;
                }
                return false;
            });
        }

        if (selectedCategory) {
            filteredArticles = filteredArticles.filter((article) => {
                return (
                    article &&
                    (article.section_name === selectedCategory ||
                        article.webTitle === selectedCategory)
                );
            });
        }

        if (selectedAuthor) {
            filteredArticles = filteredArticles.filter((article) => {
                if (
                    article &&
                    Object.prototype.hasOwnProperty.call(article, 'author') &&
                    article.author === selectedAuthor
                ) {
                    return true;
                } else if (
                    article &&
                    article.fields &&
                    Object.prototype.hasOwnProperty.call(
                        article.fields,
                        'byline'
                    ) &&
                    article.fields.byline === selectedAuthor
                ) {
                    return true;
                } else if (article && article.byline && article.byline.person) {
                    return article.byline.person.some((person) =>
                        person.firstname &&
                        person.firstname
                            .toLowerCase()
                            .startsWith(selectedAuthor.toLowerCase().slice(0, 5))
                    );
                }
                return false;
            });
        }

        setIsLoading(true)
        setGeneratedArticles(filteredArticles)

        localStorage.setItem("generatedArticles", JSON.stringify(filteredArticles));

        setTimeout(() => {
            setIsLoading(false)
        }, 5000);
    };

    useEffect(() => {
        fetchArticles();

        const storedGeneratedArticles = localStorage.getItem("generatedArticles");
        if (storedGeneratedArticles) {
            setGeneratedArticles(JSON.parse(storedGeneratedArticles));
        }
    }, []);


    return (
        <section className="customize-articles">
            <div className="container">
                <form className="filters " onSubmit={generateArticles}>
                    <h3>Customize Your Feed Article:<small> you can select what you want and we will generate articles for you </small></h3>
                    <div className="filters-content d-flex gap-5">
                        <div className="d-flex gap-5">
                            <label>Sources:</label>
                            <select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)}>
                                <option value=""></option>
                                <option id="The New York Times" value="The New York Times">The New York Times</option>
                                <option id="The Guardian" value="The Guardian">The Guardian</option>
                                <option id="News" value="News">News</option>
                            </select>
                        </div>
                        <div className="d-flex gap-5">
                            <label>Categories:</label>
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value=""></option>
                                {
                                    combinedCategory.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))
                                }
                            </select>

                        </div>
                        <div className="d-flex gap-5">
                            <label>Authors:</label>
                            <select value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)}>
                                <option value=""></option>
                                {
                                    combinedAuthor.map((author, index) => (
                                        <option key={index} value={author}>{author}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <button className="btn">Generate</button>
                    </div>
                </form>

                {isLoading && <Loader />}

                {!isLoading && (
                    <div className="articles">
                        {generatedArticles.length ? (
                            generatedArticles.map((article, index) => (
                                <Card key={index} article={article} />
                            ))
                        ) : (
                            <p className="no-data ">No articles available</p>
                        )}
                    </div>
                )}


            </div>
        </section>
    );
};

export default CustomizeArticles;

