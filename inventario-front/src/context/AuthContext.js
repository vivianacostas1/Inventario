"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
const react_1 = require("react");
const auth_service_1 = require("../api/auth.service");
const AuthContext = (0, react_1.createContext)(undefined);
const AuthProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const checkAuth = async () => {
            try {
                const data = await auth_service_1.authService.getProfile();
                setUser(data.user);
            }
            catch (error) {
                setUser(null);
            }
            finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);
    const login = async (email, password) => {
        const data = await auth_service_1.authService.login({ email, password });
        setUser(data.user);
    };
    const logout = async () => {
        try {
            await auth_service_1.authService.logout();
        }
        finally {
            setUser(null);
        }
    };
    return (<AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>);
};
exports.AuthProvider = AuthProvider;
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
