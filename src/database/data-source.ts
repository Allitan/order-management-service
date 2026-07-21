import 'dotenv/config';
import { DataSource } from 'typeorm';
import configuration from '../config/configuration';
import { validateEnvironment } from '../config/env.validation';
import { createTypeOrmOptions } from './typeorm.options';

validateEnvironment(process.env);

const { database } = configuration();

export default new DataSource(createTypeOrmOptions(database));