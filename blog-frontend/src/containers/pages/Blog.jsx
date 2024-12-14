import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { get_blog_list, get_more_blog_posts, clear_blog_list } from "../../redux/actions/blog/blog"; 
import BlogList from "../../components/blog/BlogList";
import { useSelector } from 'react-redux';
// import { useNavigate } from "react-router-dom";

function Blog({
    get_blog_list,
    get_more_blog_posts,
    clear_blog_list, 
    // posts,
    next,
    loading,
}) {
    const [loadingMore, setLoadingMore] = useState(false);

    const { user } = useSelector(state => state.auth); 
    const { blog_list } = useSelector(state => state.blog);

    const isUserLoaded = user && user.following && Array.isArray(user.following);
    const isPostsLoaded = blog_list && Array.isArray(blog_list);

    const filteredPosts = isUserLoaded && isPostsLoaded
        ? blog_list.filter(post => 
            post.author && user.following.some(following => following.id === post.author.id)
        )
        : [];

    // const navigate = useNavigate();

    useEffect(() => {
        return () => {
            clear_blog_list(); 
        };
    }, [clear_blog_list]);

    useEffect(() => {
        window.scrollTo(0, 0);
        get_blog_list();
    }, [get_blog_list]);

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
        if (bottom && !loading && next) {
            setLoadingMore(true);
            get_more_blog_posts(next);
        }
    };

    useEffect(() => {
        if (!loading) {
            setLoadingMore(false);
        }
    }, [loading]);

    return (
        <>
            <div className="pt-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl my-10">
                        <BlogList 
                            posts={Array.isArray(filteredPosts) && filteredPosts.length > 0 ? filteredPosts : []}
                            next={next}
                            loading={loading} 
                            handleScroll={handleScroll} 
                            loadingMore={loadingMore} 
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = state => ({
    posts: state.blog.blog_list,
    next: state.blog.next,
    loading: state.blog.loading,
});

const mapDispatchToProps = {
    get_blog_list,
    get_more_blog_posts,
    clear_blog_list, 
};

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
