# GraphRAG Project Flowchart

This document contains a MermaidJS flowchart that illustrates the architecture and user flows of the GraphRAG project.

```mermaid
graph TD
    subgraph Input Data
        direction LR
        subgraph GraphRAG
            direction TB
            GR[GraphRAG]
        end
        U1[<center>Students<br>(Skills, Branch)</center>]
        U2[<center>Professors<br>(Expertise, papers)</center>]
        U3[<center>Recruiters<br>(Location, Roles)</center>]
        U4[<center>Alumni<br>(Experience, Location)</center>]
    end

    subgraph RAG Query Flow
        UserQuery[User Query<br>(Natural Language)] --> QueryProcessor[Query Processor]
        QueryProcessor --> DB[(GraphRAG Database<br>Nodes + Edges)]
        DB --> RetrievedSubgraph[Retrieved Subgraph]
        RetrievedSubgraph --> RAG[Language Model (RAG)]
        RAG --> ProfileResults[Profile results]
    end

    subgraph Recommendations Flow
        U1 & U2 & U3 & U4 --> GraphEmbeddings1[Graph Embeddings]
        GraphEmbeddings1 --> DB
        
        GraphEmbeddings2[Graph Embeddings] --> Similarity[Similarity Model]
        Similarity --> Personalized[Personalized Recommendations]
    end
    
    subgraph AI Moderation and Chatbot
        subgraph Moderation
            UserPost[User creates post/comment] --> AME[AI Moderation Engine]
            AME --> CV{Content Valid?}
            CV -- NO --> Block[Block/Delete Content<br>+<br>Notify User]
            CV -- YES --> Publish[Publish to<br>Community Feed]
        end
        
        subgraph Chatbot
            UserChatQuery[User Query to Chatbot] --> CommunityFeed[Community Feed<br>Stored in Vector Database]
            CommunityFeed --> ChatbotRetrieval[Chatbot Retrieval from<br>Vector DB]
            Publish --> CommunityFeed
            ChatbotRetrieval --> ChatbotSummary[Chatbot Summarizes<br>with Thread Link]
        end
    end
    
    U1 --> GraphEmbeddings2
    U2 --> GraphEmbeddings2
    U3 --> GraphEmbeddings2
    U4 --> GraphEmbeddings2
```
