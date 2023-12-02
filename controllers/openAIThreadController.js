import OpenAI from "openai";
import { config } from "dotenv";
config({
    path: ".env"
});

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
});



const assistantID = process.env.OPEN_AI_ASSISTANT_ID;

const checkStatus = async (threadID, runID) => {
    const runs = await openai.beta.threads.runs.retrieve(
        threadID,
        runID,
    );
    return runs.status;
};

const waitForCompletion = async (runStatus, runID, threadID) => {
    while (runStatus !== "completed") {
        console.log("Sleeping for 1s");
        await sleep(1000);
        runStatus = await checkStatus(threadID, runID);
    }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const callAssistant = async (req, res) => {
    // create thread
    const thread = await openai.beta.threads.create();
    // message thread
    const message = await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: "Give Level 1 quiz in format that is provided. No additional text is necessary. Minimum size = 10 and change the questions, ans and text accordingly. You dont need to do anything extra or anything else."
    })
    // run thread
    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantID,
        instructions: "You are French quiz generator which can generate different levels of expertise catered towards different types of users and students. Levels Involves basic mcq questions, fill in the blanks etc. There are 4 levels each increasing in complexity and hardness of the French language. You take a round for 5 questions and after each round you provide your user's score and analysis of what the user has to work on. and go for next Level according to their performance and parameters you can discern out you adjust the questions accordingly. There are 4 levels Level 1, Level 2, Level 3, Leve 4 according to increasing difficulty and analysis. always return in this format and no additional text to be followed or preceded before this. {\"Lvl\":\"1\",\"size\":10,\"questions\":[{\"format\":\"mcq\",\"text\":\"What is the word for 'they' in French?\",\"options\":[{\"a\":\"Vous\"},{\"b\":\"allez\"},{\"c\":\"allez vous\"},{\"d\":\"elles/ils\"}],\"ans\":\"d\"},{\"format\":\"blankFill\",\"text\":\"${} What is the capital of France?\",\"ans\":\"Paris\"},{\"format\":\"wordCard\",\"text\":\"Girl\",\"ans\":\"Fille\"},{\"format\":\"mcq\",\"text\":\"Which of the following means 'good morning' in French?\",\"options\":[{\"a\":\"Bonsoir\"},{\"b\":\"Bonjour\"},{\"c\":\"Bonne nuit\"},{\"d\":\"Salut\"}],\"ans\":\"b\"},{\"format\":\"blankFill\",\"text\":\"The French word for 'cat' is ${}.\",\"ans\":\"chat\"},{\"format\":\"wordCard\",\"text\":\"Book\",\"ans\":\"Livre\"},{\"format\":\"mcq\",\"text\":\"What is the French word for 'yes'?\",\"options\":[{\"a\":\"Non\"},{\"b\":\"Oui\"},{\"c\":\"Peut-être\"},{\"d\":\"Merci\"}],\"ans\":\"b\"},{\"format\":\"blankFill\",\"text\":\"My name is ${}.\",\"ans\":\"Je m'appelle\"},{\"format\":\"wordCard\",\"text\":\"Car\",\"ans\":\"Voiture\"},{\"format\":\"mcq\",\"text\":\"What is the word for 'they' in French?\",\"options\":[{\"a\":\"Vous\"},{\"b\":\"allez\"},{\"c\":\"allez vous\"},{\"d\":\"elles/ils\"}],\"ans\":\"d\"}]}",
    })
    // get thread op
    await waitForCompletion(run.status, run.id, thread.id);

    const messages = await openai.beta.threads.messages.list(
        thread.id
    )

    // send op in json
    res.status(200).send({
        success: true,
        assistant: JSON.parse(messages.body.data[0].content[0].text.value)
    })
}
