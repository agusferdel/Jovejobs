import { Suspense, lazy, useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { PublicRoutes } from './PublicRoutes';
import { PrivateRoutes } from './PrivateRoutes';
import { AuthContext } from '../context/AuthContext';

// Páginas públicas
import { PublicLayout } from '../layouts/PublicLayout';
const HomePage = lazy(
  () => import('../pages/PublicPages/HomePage/HomePpalPage/HomePage')
);
const HomeRegPage = lazy(
  () => import('../pages/PublicPages/HomePage/HomeRegPage/HomeRegPage')
);

const HomeCandidate = lazy(
  () => import('../pages/PublicPages/HomePage/HomeCandidate/HomeCandidate')
);
const HomeCompany = lazy(
  () => import('../pages/PublicPages/HomePage/HomeCompany/HomeCompany')
);
const RegisterCandidatePage = lazy(
  () =>
    import('../pages/PublicPages/AuthPages/RegisterPage/RegisterCandidate/RegisterCandidatePage')
);
const ValidationRegister = lazy(
  () =>
    import('../pages/PublicPages/HomePage/ValidationRegister/ValidationRegister')
);
const ActivatePage = lazy(
  () => import('../pages/PublicPages/AuthPages/ActivatePage/ActivatePage')
);
const LoginPage = lazy(
  () => import('../pages/PublicPages/AuthPages/LoginPage/LoginPage')
);
const RecoverPasswordPage = lazy(
  () =>
    import('../pages/PublicPages/AuthPages/RecoverPasswordPage/RecoverPasswordPage')
);
const ResetPasswordPage = lazy(
  () =>
    import('../pages/PublicPages/AuthPages/ResetPasswordPage/ResetPasswordPage')
);
const RegisterCompanyPage = lazy(
  () =>
    import('../pages/PublicPages/AuthPages/RegisterPage/RegisterCompany/RegisterCompanyPage')
);
const OffersPage = lazy(
  () => import('../pages/OffersPages/OfferPage/OffersPage')
);

const OfferView = lazy(
  () => import('../pages/OffersPages/OfferPage/OfferView/OfferView')
);

const PublicCandidateProfile = lazy(
  () =>
    import('../pages/PublicPages/UserPages/CandidatePublic/PublicCandidateProfile')
);
const PublicCompanyProfile = lazy(
  () =>
    import('../pages/PublicPages/UserPages/CompanyPublic/PublicCompanyProfile')
);

const PackOptionsPage = lazy(
  () => import('../pages/PublicPages/PackPages/PackOptionsPage/PackOptionsPage')
);

const NotFoundPages = lazy(() => import('../pages/PublicPages/NotFoundPages/NotFoundPages'));

///pages/OffersPages/OfferPAge/OffersPage
//Páginas privadas de candidato
import { CandidateLayout } from '../layouts/CandidateLayout';
const CandidateProfilePage = lazy(
  () =>
    import('../pages/UserPages/Candidate/CandidateProfilePage/CandidateProfilePage')
);

const CandidateEditPage = lazy(
  () =>
    import('../pages/UserPages/Candidate/CandidateEditPage/CandidateEditPage')
);

const InfoCandidateOutlet = lazy(
  () =>
    import('../pages/UserPages/Candidate/CandidateProfilePage/InfoCandidate/InfoCandidateOutlet')
);

const CandidateApplicationOutlet = lazy(
  () =>
    import('../pages/UserPages/Candidate/CandidateProfilePage/CandidateApplicationsOutlet/CandidateApplicationOutlet')
);

const CandidateProfileSettingsOutlets = lazy(
  () =>
    import('../pages/UserPages/Candidate/CandidateProfilePage/CandidateProfileSettings/CandidateProfileSettings')
);

const StudyForm = lazy(
  () => import('../pages/UserPages/Candidate/Study/StudyForm')
);
const LanguageForm = lazy(
  () => import('../pages/UserPages/Candidate/Language/LanguageForm')
);
const ExperienceForm = lazy(
  () => import('../pages/UserPages/Candidate/Experience/ExperienceForm')
);
const EditExperience = lazy(
  () => import('../pages/UserPages/Candidate/Experience/EditExperience')
);
const EditStudy = lazy(
  () => import('../pages/UserPages/Candidate/Study/EditStudy')
);
const EditLanguage = lazy(
  () => import('../pages/UserPages/Candidate/Language/EditLanguage')
);

//Páginas privadas de company
import { CompanyLayout } from '../layouts/CompanyLayout';

const OfferForms = lazy(
  () =>
    import('../pages/UserPages/Company/CompanyProfilePage/OffersForm/OfferForms')
);
const CompanyEditPage = lazy(
  () => import('../pages/UserPages/Company/CompanyEditPage/CompanyEditPage')
);

const CompanyOfferPageOutlet = lazy(
  () =>
    import('../pages/UserPages/Company/CompanyProfilePage/CompanyOffer/CompanyOfferPageOutlet')
);
const CompanySettingPageOutlet = lazy(
  () =>
    import('../pages/UserPages/Company/CompanyProfilePage/SettingOutlet/CompanySettingPageOutlet')
);
const CompanySearchPageOutlet = lazy(
  () =>
    import('../pages/UserPages/Company/CompanyProfilePage/SearchOutlet/CompanySearchPageOutlet')
);
const CompanyProfilePage = lazy(
  () =>
    import('../pages/UserPages/Company/CompanyProfilePage/CompanyProfilePage')
);
const CompanyProfilePageOutlet = lazy(
  () =>
    import('../pages/UserPages/Company/CompanyProfilePage/ProfileOutlet/CompanyProfilePageOutlet')
);

const OfferEditPage = lazy(
  () => import('../pages/OffersPages/OfferPage/OfferEditPage/OfferEditPage')
);

const CompanyApplications = lazy(
  () =>
    import('../pages/UserPages/Company/CompanyProfilePage/CompanyApplications/CompanyApplications')
);

//Paginas privadas del Admin
import { AdminLayout } from '../layouts/AdminLayout';

const AdminEditPack = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/AdminEditPage/AdminEditPage')
);

const AdminCreatePack = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/AdminCreatePack/AdminCreatePack')
);

const AdminPacksOutlet = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/AdminPacksOutlet/AdminPacksOutlet')
);

const AdminOfferApplicationsOutlet = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/AdminOfferApplicationsOutlet/AdminOfferApplicationsOutlet')
);
const AdminCandidateApplicationsOutlet = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/AdminCandidateApplicationsOutlet/AdminCandidateApplicationsOutlet')
);

const AdminCandidateDetailOutlet = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/AdminCandidateDetailOutlet/AdminCandidateDetailOutlet')
);

const AdminDashboardPage = lazy(
  () => import('../pages/AdminPages/AdminDashboardPage/AdminDashboardPage')
);
const ListCompanyOutlet = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/ListCompaniesOutlet/ListCompaniesOutlet')
);
const AdminCompanyOffersOutlet = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/AdminCompanyOffersOutlet/AdminCompanyOffersOutlet')
);
const ListCandidateOutlet = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/ListCandidatesOutlet/ListCandidatesOutlet')
);
const ListOffersOutlet = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/ListOffersOutlet/ListOffersOutlet')
);
const AdminCompanyDetailOutlet = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/AdminCompanyDetailOutlet/AdminCompanyDetailOutlet')
);
const ChangePassword = lazy(
  () => import('../pages/UserPages/Common/ChangePassword')
);
const ConfigOffersOutlet = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/ConfigOffersOutlet/ConfigOffersOutlet')
);
const JobOutlet = lazy(
  () => import('../pages/AdminPages/AdminDashboardPage/JobOutlet/JobOutlet')
);
const WorkdayOutlet = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/WorkdayOutlet/WorkdayOutlet')
);
const OfferTypeOutlet = lazy(
  () =>
    import('../pages/AdminPages/AdminDashboardPage/OfferTypeOutlet/OfferTypeOutlet')
);

export const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Suspense fallback={<h2>Cargando...</h2>} >
        <Routes>
          {/* Rutas públicas */}
          <Route element={<PublicRoutes />}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/selector" element={<HomeRegPage />} />
              <Route path="/homeCandidate" element={<HomeCandidate />} />
              <Route path="/homeCompany" element={<HomeCompany />} />
              <Route path="/register" element={<HomeRegPage />} />
              <Route path="/rates" element={<PackOptionsPage />} />
              <Route
                path="/validationRegister"
                element={<ValidationRegister />}
              />
              <Route
                path="/registerCandidate"
                element={<RegisterCandidatePage />}
              />
              <Route
                path="/registerCompany"
                element={<RegisterCompanyPage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/recoverPassword"
                element={<RecoverPasswordPage />}
              />
              <Route
                path="/resetPassword/:token"
                element={<ResetPasswordPage />}
              />
              <Route
                path="/activate/:token"
                element={<ActivatePage />}
              />
              
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/offer/:id" element={<OfferView />} />
              <Route
                path="/candidate/public/:id"
                element={<PublicCandidateProfile />}
              />
              <Route
                path="/company/public/:id"
                element={<PublicCompanyProfile />}
              />
            </Route>
          </Route>
          {/* Rutas privadas user Candidato */}
          <Route element={<PrivateRoutes user={user} requiredType={3} />}>
            <Route element={<CandidateLayout />}>
              <Route
                path="/candidateProfile"
                element={<CandidateProfilePage />}
              >
                <Route index element={<InfoCandidateOutlet />} />

                <Route
                  path="applications"
                  element={<CandidateApplicationOutlet />}
                />

                <Route
                  path="settings"
                  element={<CandidateProfileSettingsOutlets />}
                />
                <Route path="changePassword" element={<ChangePassword />} />
              </Route>
              <Route path="/newStudy" element={<StudyForm />} />
              <Route path="/editStudy/:id" element={<EditStudy />} />
              <Route path="/newLanguage" element={<LanguageForm />} />
              <Route path="/editLanguage/:id" element={<EditLanguage />} />
              <Route path="/newExperience" element={<ExperienceForm />} />
              <Route path="/editExperience/:id" element={<EditExperience />} />
              <Route path="/edit-candidate" element={<CandidateEditPage />} />
            </Route>
          </Route>
          {/* Rutas privadas user Empresa */}
          <Route element={<PrivateRoutes user={user} requiredType={2} />}>
            <Route element={<CompanyLayout />}>
              <Route path="/companyProfile/" element={<CompanyProfilePage />}>
                <Route index element={<CompanyProfilePageOutlet />} />
                <Route path="offers" element={<CompanyOfferPageOutlet />} />
                <Route path="settings" element={<CompanySettingPageOutlet />} />
                <Route path="search" element={<CompanySearchPageOutlet />} />
                <Route path="changePassword" element={<ChangePassword />} />
              </Route>
              <Route
                path="/applications/:offer_id/candidates"
                element={<CompanyApplications />}
              />
              <Route path="/registerOffer" element={<OfferForms />} />
              <Route path="/edit-company" element={<CompanyEditPage />} />
              <Route path="/offers/edit/:id" element={<OfferEditPage />} />
            </Route>
          </Route>
          {/* Rutas privadas user <Admin> */}
          <Route element={<PrivateRoutes user={user} requiredType={1} />}>
            <Route element={<AdminLayout />}>
              <Route path="/adminDashboard" element={<AdminDashboardPage />}>
                <Route index element={<ListCompanyOutlet />} />
                <Route
                  path="companyProfile/:companyId"
                  element={<AdminCompanyDetailOutlet />}
                />
                <Route
                  path="offersCompany/:companyId"
                  element={<AdminCompanyOffersOutlet />}
                />
                <Route path="candidates" element={<ListCandidateOutlet />} />
                <Route
                  path="candidateProfile/:candidateId"
                  element={<AdminCandidateDetailOutlet />}
                />
                <Route path="offers" element={<ListOffersOutlet />} />
                <Route
                  path="candidateApplications/:candidateId"
                  element={<AdminCandidateApplicationsOutlet />}
                />
                <Route
                  path="offers/:companyId/:offerId/applications"
                  element={<AdminOfferApplicationsOutlet />}
                />
                <Route path="packs" element={<AdminPacksOutlet />} />
                <Route path="createPack" element={<AdminCreatePack />} />
                <Route path="editPack/:pack_id" element={<AdminEditPack />} />
                <Route path="configOffers" element={<ConfigOffersOutlet />}>
                  <Route path="offerTypes" element={<OfferTypeOutlet />} />
                  <Route path="workdayTypes" element={<WorkdayOutlet />} />
                  <Route path="jobs" element={<JobOutlet />} />
                </Route>
                <Route path="changePassword" element={<ChangePassword />} />
              </Route> 
                <Route path="/offersAdmin/edit/:id" element={<OfferEditPage />}/>
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPages />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
