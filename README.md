# Dota2 Vue.js App
This is a Vue.js app that allows users to view and analyze Dota2 heroes, teams information, and matchups.

## Installation
1. Clone the repository: `git clone https://github.com/johnmichealacera/dota2-vue-app.git`
2. Navigate to the project directory: `cd dota2-vue-app`
3. Install dependencies: `npm install`
### Environment Variables
The application requires the following environment variable to be set:

`VUE_APP_DOTA_BACKEND_API`: : The backend service the vue app fetches the dota info.

Create a `.env` file in the root directory of the project with the following values:
`VUE_APP_DOTA_BACKEND_API=http://localhost:8000`
## Usage
1. Start the development server: `npm run serve`
2. Navigate to `http://localhost:8080/` in your browser
## Built With
- [Vue.js](https://vuejs.org/v2/guide/) - The web framework used
- [Vue Router](https://router.vuejs.org/) - Router for single-page applications
- [Axios](https://github.com/axios/axios/blob/master/README.md) - Promise-based HTTP client
- [Tailwind](https://tailwindcss.com/docs) - Front-end component library
## Contributing
1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request
## License
This project is licensed under the MIT License - see the [LICENSE.md](https://opensource.org/license/mit/) file for details.

## Acknowledgments
- [Vue.js](https://vuejs.org/v2/guide/) documentation
- [Tailwind](https://tailwindcss.com/docs) documentation
- [Axios](https://github.com/axios/axios/blob/master/README.md) documentation