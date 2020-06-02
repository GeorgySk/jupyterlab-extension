from notebook.base.handlers import APIHandler


class RucioAPIHandler(APIHandler):
    def initialize(self, rucio_config, *args, **kwargs):
        super().initialize(*args, **kwargs)
        self.rucio_config = rucio_config