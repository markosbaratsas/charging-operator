import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Layout1 from './components/Layout1';
import {
  Switch,
  Route,
  Routes,
} from 'react-router-dom';

function App() {
    return (
        <Routes>
            {/* public routes */}
            <Route path="/" element={<Layout1 />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                {/* <Route path="/register" element={<Register />} /> */}
            </Route>
                {/* <Route path="register" element={<Register />} />
                <Route path="linkpage" element={<LinkPage />} />
                <Route path="unauthorized" element={<Unauthorized />} /> */}

                {/* we want to protect these routes */}
                {/* <Route element={<RequireAuth />}>
                    <Route path="/" element={<Home />} />
                </Route> */}

                {/* <Route element={<RequireAuth />}>
                    <Route path="editor" element={<Editor />} />
                </Route> */}

                {/* catch all */}
                {/* <Route path="*" element={<Missing />} /> */}
        </Routes>
    );
}

export default App;
