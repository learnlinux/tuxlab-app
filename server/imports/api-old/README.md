# A Tale of Three Labs
## The Lab Datastructures:
Because of the way that TuxLab creates, executes, and stores Labs, there are three distinct lab objects, each representing a different "phase" of a lab:

### lab.model (in the both/models folder)
LabModel is an interface describing the way the Lab object is stored in the database.  As with all other models, it contains the basic metadata (name, description, last updated, etc).  It stores the lab code itself as a minified string.  

### lab.file (in the server/api folder)
LabFile is an interface which instructors use to build Labs.  Upon calling the constructor, it is populated with the name, description, and an environment configuration variable.  The instructor can then call additional methods to add an initialization and destruction method, and tasks, which are added to internal datastructures.

### lab.instance (in the server/api folder)
LabInstance is a wrapper around the lab.file format, which can easily be constructed from either an input string (in lab.file format), or a lab.model object.  This object then serves as the interface to the TuxLab frontend, as it exposes functions allowing the user to call task methods.

## Why?
This design has a couple of distinct benefits:
- We need to be able to store task data in the database prior to execution (this makes it easier to grade).
- Lab.instance acts as a sandbox around lab.file, allowing us to run untrusted code.
- Lab.file is a stable API for instructors, and it is substantially easier to understand than the un-obfuscated API.

Most importantly though, this design is central to our ability to cache labs.  When a lab is run for the first time, we create a LabInstance, which is cached for all other users running the same lab.  This saves TONS of DB IO and Memory.  It is therefore imperative that each function is purely functional and stateless, otherwise variables would be shared across tasks or users.

# What's Better Than VMs? Containers!
But most people don't know what a container is- so we call it a virtual machine.
