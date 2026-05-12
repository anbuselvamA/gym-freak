import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyD2gMwNSChPRRnajXZRw7ElfBv9JPIDd98');

async function test() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyD2gMwNSChPRRnajXZRw7ElfBv9JPIDd98`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Models:", data.models.map(m => m.name));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

test();
