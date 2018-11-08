import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SimulationComponent } from './components/simulation/simulation.component';

const appRoutes = [

    { 	
    	path: 'home', 
    	component: HomeComponent,  
    },
    { 	
    	path: 'simulation', 
    	component: SimulationComponent,  
    },
    {
		path: '**', 
		redirectTo: 'home', 
		pathMatch: 'full' 
	},

];

export const routing = RouterModule.forRoot(appRoutes);
