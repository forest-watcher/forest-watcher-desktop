# What are these hooks doing?

 These hooks encompass a process to request an async process on the backend.

The documentation at the [fw_exports](https://wri.github.io/fw_exports/?env=dev#/operations/post-v3-reports-templateId-exportSome) docs explain why we have to poll.

## In short the flow is:

- Request an export
- Wait for an export to finish (by polling an endpoint, see `checkStaus` function)
- Return the value when it is done

These hooks return a useMutation hook for familiarity.

# TODO
- Move duplicate code into some form of helper functions / hooks (e.g. the checkStatus function)