import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

import authRouter from './modules/auth/auth.routes.js';
import usersRouter from './modules/users/users.routes.js';
import offerRouter from './modules/offer/offer.routes.js';
import companyRouter from './modules/company/company.routes.js';
import candidateRouter from './modules/candidate/candidate.routes.js';
import studyRouter from './modules/candidate/study/study.routes.js';
import languageRouter from './modules/candidate/language/language.routes.js';
import experienceRouter from './modules/candidate/experience/experience.routes.js';
import adminRouter from './modules/admin/admin.routes.js';
import offerTypeRouter from './modules/admin/offerType/offerType.routes.js';
import jobRouter from './modules/admin/Job/job.routes.js';
import workdayTypeRouter from './modules/admin/workdayType/workdayType.routes.js';
import provinceRouter from './modules/province/province.routes.js';
import cityRouter from './modules/city/city.routes.js';
import packRouter from './modules/pack/pack.routes.js';
import purchaseRouter from './modules/purchase/purchase.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/offerType', offerTypeRouter);
app.use('/api/workdayType', workdayTypeRouter);
app.use('/api/job', jobRouter);
app.use('/api/offers', offerRouter);
app.use('/api/company', companyRouter);
app.use('/api/candidate', candidateRouter);

app.use('/api/studies', studyRouter);
app.use('/api/languages', languageRouter);
app.use('/api/experience', experienceRouter);

app.use('/api/province', provinceRouter);
app.use('/api/city', cityRouter);
app.use('/api/pack', packRouter);
app.use('/api/purchase', purchaseRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json(err);
});

export default app;
