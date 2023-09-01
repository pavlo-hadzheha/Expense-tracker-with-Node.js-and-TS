import dotenv from 'dotenv';
import { RootModule } from '@/modules/RootModule';

dotenv.config();

new RootModule().start();
