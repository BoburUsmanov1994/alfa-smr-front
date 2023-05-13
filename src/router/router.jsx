import React, {lazy, Suspense} from 'react';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import MainLayout from "../layouts/main-layout";
import AuthLayout from "../layouts/auth-layout";
import LoginPage from "../modules/auth/pages/LoginPage";
import IsAuth from "../services/auth/IsAuth";
import IsGuest from "../services/auth/IsGuest";
import NotFoundPage from "../modules/auth/pages/NotFoundPage";
import {OverlayLoader} from "../components/loader";
import LogOutPage from "../modules/auth/pages/LogOutPage";
//lazy load
const SmrListPage = lazy(() => import("../modules/agreement/pages/smr/ListPage"));
const SmrViewPage = lazy(() => import("../modules/agreement/pages/smr/ViewPage"));
const SmrUpdatePage = lazy(() => import("../modules/agreement/pages/smr/UpdatePage"));
const SmrCreatePage = lazy(() => import("../modules/agreement/pages/smr/CreatePage"));

const Router = ({...rest}) => {
    return (
        <BrowserRouter>
            <Suspense fallback={<OverlayLoader/>}>
                <IsAuth>
                    <Routes>
                        <Route path={"/"} element={<MainLayout/>}>
                            <Route path={"smr"}>
                                <Route index element={<SmrListPage/>}/>
                                <Route path={"create"} element={<SmrCreatePage/>}/>
                                <Route path={"view/:form_id"} element={<SmrViewPage/>}/>
                                <Route path={"update/:form_id"} element={<SmrUpdatePage/>}/>
                            </Route>
                            <Route path="/auth/logout" element={<LogOutPage/>}/>
                            <Route path={"auth/*"} element={<Navigate to={'/smr'} replace/>}/>
                            <Route path={"/"} element={<Navigate to={'/smr'} replace/>}/>
                            <Route path={"*"} element={<NotFoundPage/>}/>
                        </Route>
                    </Routes>
                </IsAuth>

                <IsGuest>
                    <Routes>
                        <Route path={"/auth"} element={<AuthLayout/>}>
                            <Route index element={<LoginPage/>}/>
                        </Route>
                        <Route path={"*"} element={<Navigate to={'/auth'} replace/>}/>
                    </Routes>
                </IsGuest>
            </Suspense>
        </BrowserRouter>
    );
};

export default Router;