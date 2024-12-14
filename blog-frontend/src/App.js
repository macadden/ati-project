import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import AnimatedRoutes from './hocs/routes/Routes';

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>A.T.I. | Blog Project</title>
        <meta
          name="description"
          content="Blog. Trabajo final para la materia A.T.I. de la U.T.N. F.R.L.P."
        />
        <meta name="keywords" content="Blog, Universidad, A.T.I., U.T.N., AWS, nube" />
        <meta name="robots" content="all" />
        <link rel="canonical" href="" />
        <meta name="author" content="A.T.I." />
        <meta name="publisher" content="A.T.I." />
        {/* Social Media Tags */}
        <meta property="og:title" content="A.T.I. | Blog" />
        <meta
          property="og:description"
          content="Blog. Trabajo final para la materia A.T.I. de la U.T.N. F.R.L.P."
        />
        <meta property="og:url" content="" />
        <meta
          property="og:image"
          content=""
        />
        <meta name="twitter:title" content="A.T.I. | Blog" />
        <meta
          name="twitter:description"
          content="Blog. Trabajo final para la materia A.T.I. de la U.T.N. F.R.L.P."
        />
        <meta name="twitter:image" content="" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Router>
        <AnimatedRoutes />
      </Router>
    </HelmetProvider>
  );
}

export default App;