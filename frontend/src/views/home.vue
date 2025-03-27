<template>
  <div>
    <header class="p-4 flex justify-between items-center w-full bg-black z-10">
        <a href="/" class="text-xl flex justify-center permanent-marker-regular text-gray-100">808Wave</a>
        <div @click="showModal = !showModal" class="hidden sm:flex space-x-4 cursor-pointer">
          <div @click="toggleCart('cart1')" class="relative flex items-center justify-center w-16 h-18 text-center text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>

            <span v-if="cartCount > 0" class="relative -top-3 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {{ cartCount }}
            </span>

            <div v-if="showModal" class="absolute top-full -right-3 w-86 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
              <p class="font-bold text-center mb-2">Seu Carrinho</p>
              <div v-if="cartItems.length > 0" class="max-h-40 overflow-y-auto">
                    <div v-for="(item, index) in cartItems" :key="index" class="mb-4">
                       
                        <div class="z-30">
                            <p class="font-semibold">{{ item.titulo }}</p>
                            <p class="text-gray-400 text-xs">{{ item.valor }}</p>
                        </div>
                        <button 
                            @click="removeFromCart(index)" 
                            class="text-red-500 hover:underline text-xs mt-2 cursor-pointer">
                            Remover
                        </button>
                    </div>
                    <button 
                        @click="checkout" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-2 cursor-pointer">
                        Comprar
                    </button>
                </div>
              <p v-else class="text-gray-400 text-center">Seu carrinho está vazio.</p>
            </div>
          </div>
        </div>
    </header>

    <section class="flex h-100">
      <div class="w-screen h-105 flex flex-col justify-center px-24 opacity-70 bg-no-repeat bg-cover bg-capa">
          <h1 class="text-gray-100 font-bold text-5xl permanent-marker-regular">prod.jp</h1>
          <h3 class="poppins-thin text-gray-100 mt-3 text-base">Produtor / Beatmaker </h3>
      </div>
    </section>

    <section class="grid grid-cols-12 gap-4 p-4 md:p-10 bg-black h-auto transform transition-transform duration-500">
      <div v-for="beat in beats" :key="beat.titulo" class="col-span-12 md:col-span-4 hover:scale-105 text-white transform transition-transform duration-500 rounded-lg">
        <div @click="playerSong(beat.audio)" class="music-bg flex flex-col items-center rounded-lg cursor-pointer" :style="`background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('${beat.capa}'); background-repeat: no-repeat; background-size: contain; background-position: center;`">
          <div class="flex justify-center	items-center h-full">
              <svg v-if="!isPlayer || isPlayer && audioAtual !== beat.audio" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-12 w-12 text-white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
              </svg>  
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-12 w-12 text-white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z" />
              </svg>                                          
          </div>
          <div class="h-full relative">
              <routerLink :to="`/detail/${beat.id}`" class="text-xl block font-semibold text-white">{{ beat.titulo }}</routerLink>
              <p class="text-gray-400 m-1">by prod.jp</p>
              <span class="text-sm text-gray-400">Gênero</span>
              <span class="text-sm text-gray-400"> • </span>
              <span class="text-sm text-gray-400">{{ beat.genero }}</span>
          </div>
        </div>
        <div class="absolute top-80 rounded-lg w-full">
          <div class="flex rounded-lg">
            <button @click="addToCart(beat)" class="opacity-70 flex items-center justify-center bg-gray-700 hover:bg-gray-900 rounded-lg h-11 text-gray-300 hover:text-gray-400 space-x-1 w-full cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span>{{ beat.valor }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div v-if="cartCount > 0" class="fixed bottom-8 right-5 p-3 rounded-full bg-linear z-10">
            <a href="#" @click.prevent="toggleCart('cart2')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="gray" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {{ cartCount }}
              </span>
            </a>

            <div v-if="cartVisibility['cart2']" class="absolute -top-2 -right-5 -translate-y-full w-86 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                <p class="font-bold text-center mb-2">Seu Carrinho</p>
                <div v-if="cartItems.length > 0" class="max-h-40 overflow-y-auto">
                    <div v-for="(item, index) in cartItems" :key="index" class="mb-4">
                       
                        <div class="z-30">
                            <p class="font-semibold">{{ item.titulo }}</p>
                            <p class="text-gray-400 text-xs">{{ item.valor }}</p>
                        </div>
                        <button
                            @click="removeFromCart(index)" 
                            class="text-red-500 hover:underline text-xs mt-2 cursor-pointer">
                            Remover
                        </button>
                    </div>
                    <button 
                        @click="checkout" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-2 cursor-pointer">
                        Comprar
                    </button>
                </div>
                <p v-else class="text-gray-400 text-center">Seu carrinho está vazio.</p>
            </div>
        </div>

    <footer class="grid grid-cols-1 sm:grid-cols-3 items-center bg-black opacity-80 h-full gap-5 ">
      <a href="/" class="text-gray-300 permanent-marker-regular text-center">&copy808Wave-2024</a>
      <div class="m-5 w-56 p-3 sm:flex-row">
      <h1 class="text-gray-300 p-3 flex permanent-marker-regular sm:flex-left">Redes Sociais :</h1>
          <a href="https://www.instagram.com/jp1st_?igsh=MTIxdG45N2Q5czZraw%3D%3D&utm_source=qr" target="_blank" class="text-white w-48 flex gap-2 hover:bg-purple-900 opacity-50 p-2 rounded poppins-thin hover:scale-105 transform transition-transform duration-200"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 256 256"><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path></svg>Instagram</a>
          <a href="https://on.soundcloud.com/n4VEqHpb2jUKtdAr6" target="_blank" class="text-white w-48 flex gap-2 hover:bg-purple-900 opacity-50 p-2 rounded poppins-thin hover:scale-105 transform transition-transform duration-200"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 256 256"><path d="M24,120v48a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0ZM48,88a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V96A8,8,0,0,0,48,88Zm32-8a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V88A8,8,0,0,0,80,80Zm32-32a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V56A8,8,0,0,0,112,48Zm110.84,58.34A80,80,0,0,0,144,40a8,8,0,0,0,0,16,63.76,63.76,0,0,1,63.68,57.53,8,8,0,0,0,6.44,7A32,32,0,0,1,208,184H144a8,8,0,0,0,0,16h64a48,48,0,0,0,14.84-93.66Z"></path></svg>Soundclound</a>
          <a href="https://www.youtube.com/@prod.jp1st" target="_blank" class="text-white w-48 flex gap-2 hover:bg-purple-900 opacity-50 p-2 rounded poppins-thin hover:scale-105 transform transition-transform duration-200"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 256 256"><path d="M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z"></path></svg>YouTube</a>
      </div>
      <div class="m-5 w-56 p-3">
          <h1 class="text-gray-300 p-3 permanent-marker-regular ">Suporte :</h1>
          <a href="https://wa.me/55999669574" target="_blank" class="text-white w-48 flex gap-2 hover:bg-purple-900 opacity-50 p-2 rounded poppins-thin hover:scale-105 transform transition-transform duration-200"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 256 256"><path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"></path></svg>WhatsApp</a>
          <a href="mailto:prodjp1st.contact@gmail.com.br" target="_blank" class="text-white w-48 flex gap-2 hover:bg-purple-900 opacity-50 p-2 rounded poppins-thin hover:scale-105 transform transition-transform duration-200"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"></path></svg>Email</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const audio = ref(null); // 
  const audioAtual = ref(null); // audio em reprodução

  const isPlayer = ref(null); // verifica se o audio está em reprodução

  const cartCount = ref(0); 
  const cartVisibility = ref({});

  const cart1 = ref(false);
  const cart2 = ref(false);
  const showModal = ref(false);

  const cartItems = ref([]);

  const beats = ref([
    {
        id: '191c2',
        audio: 'audios/FREE Rudies.wav',
        capa: 'img/FREE Rudies.jpeg',
        titulo: '[FREE] PLUG Type Beat Rudies Flacko x Dessiiik - "defeitos" (prod.jp_)',
        genero: 'Pluggnb',
        valor: 'R$ 60,00'
    }, 
    {
        id: 'n0165',
        audio: 'audios/FREE derek.wav',
        capa: 'img/derek.jpeg',
        titulo: '[FREE] DEREK x Ryu the Runner x Neckklace x Type Beat - "bloco de cash"',
        genero: 'Trap',
        valor: 'R$ 60,00'
    },
    {
        id: '5f833',
        audio: 'audios/FREE Brocasito.wav',
        capa: 'img/capaplug.jpeg',
        titulo: '[FREE] PLUG Type Beat Brocasito x Rudies Flacko - "stu" (prod.jp)',
        genero: 'Plugg',
        valor: 'R$ 60,00'
    },
    // {
    //     id: 'd843t',
    //     audio: 'audios/prod.jptf.wav',
    //     capa: 'img/caio.jpg',
    //     titulo: '[FREE] Mc Ryan x Mc Kevin x TrapFunk x Type Beat | "Fim de ano"',
    //     genero: 'Funk',
    //     valor: 'R$ 60,00'
    // }
  ]);


  async function playerSong(song) {
    try {
      if (!audio.value) {
        console.log("song", song);
        audio.value = new Audio(song);
        console.log("audio", audio);
        audioAtual.value = song;
        
        audio.value.volume = 0.4;
        audio.value.play();
        
        isPlayer.value = true;
      } else if (audio.value.paused && audioAtual.value === song) {

        audio.value.volume = 0.4;
        audio.value.play();
        isPlayer.value = true;

      } else if (!audio.value.paused && audioAtual.value === song) {
        audio.value.pause();
        isPlayer.value = false;

      } else {
        audio.value.pause();
        audio.value = new Audio(song);
        audioAtual.value = song;
        audio.value.volume = 0.4;
        audio.value.play();
        isPlayer.value = true;
      }
    } catch(err) {
      isPlayer.value = false;
    }
  }

  function addToCart(beat) {
    if (!cartItems.value.map(item => item.id).includes(beat.id)) {
      cartItems.value.push(beat);
      cartCount.value = this.cartItems.length;
      showModal.value = true;
    }
  }

  function toggleCart(id) {
    cartVisibility.value = { [id]: !cartVisibility.value[id] };
  }

  function removeFromCart(index) {
    cartItems.value.splice(index, 1);
    cartCount.value = cartItems.value.length;
  }

  function checkout() {
                        
    let message = `Olá, gostaria de comprar o(s) seguinte(s) beat(s):\n`;
    for(let i = 0; i < cartItems.value.length; i++){
      const item  = cartItems.value[i];
      message += `* ${item.titulo}\n`
    }

    const telefone = `5542999669574`; 
    const whats = `https://wa.me/${telefone}?text=${encodeURIComponent(message)}`
    window.open(whats, '_blank');
    window.location.search();
  }

</script>
