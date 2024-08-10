export const getStepHeader = (stepNumber) => {
  switch (stepNumber) {
    case 1: 
      return `
          <h2 class="text-3xl text-white w-[90%]" id="header-title">
            Take the first step towards your dream project
          </h2>
          <br />
          <p class="text-[#D3D3D3] w-[90%]" id="header-description">
            Use our price estimator to get a project estimate tailored to your
            needs. It's quick, easy, and free.
          </p>
      `;
    case 2:
      return `
        <p class="text-[#D3D3D3] absolute right-4 text-[0.7rem]">Host & Management</p>
        <div class="mt-8 z-10 flex items-center justify-between">
          <div class="flex items-center gap-2 flex-grow">
            <div
              class="text-white w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border border-white"
            >
              1
            </div>
            <div class="h-1 bg-white w-full relative overflow-hidden">
              <div class="h-full bg-yellowTheme absolute left-0 top-0 w-0"></div>
            </div>
          </div>
          <div class="flex items-center gap-2 ml-2">
            <div
              class="bg-yellowTheme text-black w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border border-yellowTheme"
            >
              2
            </div>
          </div>
        </div>
      `;
    case 3:
      return `
        <p class="text-[#D3D3D3] absolute left-8 text-[0.7rem]">Functionalities</p>
        <div class="mt-8 z-10 flex items-center justify-between">
          <div class="flex items-center gap-2 flex-grow">
            <div
              class="text-white w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border border-white"
            >
              1
            </div>
            <div class="h-1 bg-white w-full relative overflow-hidden">
              <div class="h-full bg-yellowTheme absolute left-0 top-0 w-0"></div>
            </div>
          </div>
          <div class="flex items-center gap-2 ml-2">
            <div
              class="bg-yellowTheme text-black w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border border-yellowTheme"
            >
              2
            </div>
          </div>
        </div>
      `;
    default:
      return '';
  }
};

export const getMobileStepHeader = (stepNumber) => {
  switch (stepNumber) {
    case 1:
      return `
        <h2 class="text-white text-left text-3xl">
          Take the first step towards your dream project.
        </h2>
        <br />
        <p class="text-left text-[#d3d3d3]">
          use our price estimator to get a project estimate tailored to your
          needs. it's quick, easy, and free.
        </p>
        <img
          src="assets/images/staircase.svg"
          alt="staircase"
          class="w-[60%] absolute bottom-0"
        />
      `;
    case 2:

      return `
        <div class="flex flex-row gap-3 items-center opacity-80">
          <p class="font-bold bg-yellowTheme flex items-center justify-center w-8 h-8 rounded-full">1</p>
          <p class="text-white">Functionalities</p>
        </div>
        <div class="mt-12 flex flex-row gap-3 items-center">
          <p class="text-white font-bold flex items-center justify-center w-8 h-8 border-2 rounded-full">2</p>
          <p class="text-white">Hosting & Management</p>
        </div>
      `;
    case 3:
      return `
        <div class="flex flex-row gap-3 items-center">
          <p class="text-white font-bold flex items-center justify-center w-8 h-8 border-2 rounded-full"><i class="fas fa-check"></i></p>
          <p class="text-white">Functionalities</p>
        </div>
        <div class="mt-12 flex flex-row gap-3 items-center opacity-80">
          <p class="font-bold bg-yellowTheme flex items-center justify-center w-8 h-8 rounded-full">2</p>
          <p class="text-white">Hosting & Management</p>
        </div>
      `;
    default:
      return '';
  }
};